import { expect, test, type Page } from '@playwright/test'

async function delayPortfolioViews(page: Page) {
  await page.route('**/assets/*Portfolio-*.js', async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 250))
    await route.continue()
  })
}

async function expectSectionInView(page: Page, id: string) {
  await expect.poll(() => page.locator(`#${id}`).evaluate((element) => {
    const top = element.getBoundingClientRect().top
    return top >= -1 && top < window.innerHeight
  })).toBe(true)
}

const views = [
  { name: 'Cyber', path: '/cyber/', title: /Roushan Kumar.*Data & AI Engineer/, theme: 'cyber' },
  { name: 'Studio', path: '/studio/', title: /Roushan Kumar.*The Studio/, theme: 'studio' },
  { name: 'Play', path: '/', title: /Roushan's World.*Playable Portfolio/, theme: 'play' },
]

for (const view of views) {
  test(`${view.name}: direct URL, navigation, assets, motion, and responsive layout`, async ({ page, request }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(view.path)
    await expect(page).toHaveTitle(view.title)
    await expect(page.locator('body')).toHaveAttribute('data-theme', view.theme)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    const styles = page.getByRole('navigation', { name: 'Portfolio styles' })
    await expect(styles.getByRole('link', { name: view.name, exact: true })).toHaveAttribute('aria-current', 'page')
    await expect(page.locator('a[download]').first()).toHaveAttribute('href', '/resume/Roushan-Kumar-Resume.pdf')
    await expect.poll(async () => page.evaluate(() => document.fonts.status)).toBe('loaded')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    await page.getByRole('button', { name: 'Pause animations', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused')
    await page.getByRole('button', { name: 'Enable animations', exact: true }).click()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'enabled')
    const portrait = await request.get('/assets/roushan.webp')
    expect(portrait.ok()).toBe(true)
    expect(portrait.headers()['content-type']).toContain('image/webp')
    expect(errors).toEqual([])
    await page.reload()
    await expect(page.getByRole('main')).toBeVisible()
  })
}

test('all three experiences are reachable from the persistent switcher', async ({ page }) => {
  await page.goto('/')
  const nav = page.getByRole('navigation', { name: 'Portfolio styles' })
  await nav.getByRole('link', { name: 'Studio', exact: true }).click()
  await expect(page).toHaveURL(/\/studio\/$/)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await nav.getByRole('link', { name: 'Play', exact: true }).click()
  await expect(page).toHaveURL('http://127.0.0.1:4173/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await nav.getByRole('link', { name: 'Cyber', exact: true }).click()
  await expect(page).toHaveURL('http://127.0.0.1:4173/cyber/')
})

test('legacy play links redirect to the welcome page without losing query or section', async ({ page }) => {
  await delayPortfolioViews(page)
  await page.goto('/play/?from=resume#play-portfolio')
  await expect(page).toHaveURL('http://127.0.0.1:4173/?from=resume#play-portfolio')
  await expect(page.locator('body')).toHaveAttribute('data-theme', 'play')
  await expect(page.getByTestId('play-world')).toHaveAttribute('data-state', 'ready')
  await expectSectionInView(page, 'play-portfolio')
})

test('initial section links scroll after every lazy-loaded portfolio renders', async ({ page }) => {
  await delayPortfolioViews(page)
  for (const [path, id] of [['/', 'play-portfolio'], ['/cyber/', 'cyber-work'], ['/studio/', 'studio-work']]) {
    await page.goto(`${path}#${id}`)
    await expect(page.getByRole('main')).toBeVisible()
    await expectSectionInView(page, id)
  }
})

test('the actual two-page résumé downloads as a PDF', async ({ page, request }) => {
  const response = await request.get('/resume/Roushan-Kumar-Resume.pdf')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('application/pdf')
  const contents = await response.body()
  expect(contents.subarray(0, 5).toString()).toBe('%PDF-')
  expect(contents.length).toBeGreaterThan(600_000)
  await page.goto('/')
  const downloadPromise = page.waitForEvent('download')
  await page.locator('a[download]').first().click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('Roushan-Kumar-Resume.pdf')
  expect(await download.failure()).toBeNull()
})

test('project filtering opens a real case study and restores focus', async ({ page }) => {
  await page.goto('/cyber/')
  const filters = page.getByRole('group', { name: 'Filter projects' })
  await filters.getByRole('button', { name: 'Applied AI', exact: true }).click()
  await expect(page.locator('.cyber-project')).toHaveCount(1)
  const trigger = page.getByRole('button', { name: 'Explore Agents that connect.', exact: true })
  await trigger.click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'Agents that connect.', exact: true })).toBeVisible()
  await expect(dialog.getByRole('heading', { name: 'The challenge', exact: true })).toBeVisible()
  await expect(dialog.getByText('No private client code or data is shared.', { exact: false })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(trigger).toBeFocused()
  await filters.getByRole('button', { name: 'Analytics', exact: true }).click()
  await expect(page.locator('.cyber-project')).toHaveCount(1)
  await page.getByRole('button', { name: 'Explore Big data. Clear decisions.', exact: true }).click()
  await expect(page.getByRole('dialog').getByText('40% reduction in update time through daily process automation.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Close dialog', exact: true }).click()
  await filters.getByRole('button', { name: 'All work' }).click()
  await expect(page.locator('.cyber-project')).toHaveCount(4)
})

test('career accordion and recruiter quick view expose sourced details', async ({ page }) => {
  await page.goto('/cyber/')
  const role = page.getByRole('button', { name: /Apr 2024 - Feb 2026.*Senior Data Engineer/ })
  await role.click()
  await expect(role).toHaveAttribute('aria-expanded', 'true')
  await expect(page.locator('#career-tmobile')).toBeVisible()
  await expect(page.locator('#career-tmobile')).toContainText('50%')
  await role.click()
  await expect(page.locator('#career-tmobile')).toBeHidden()
  await page.getByRole('button', { name: /Short on time/ }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'The 30-second introduction.' })).toBeVisible()
  await expect(dialog.getByText('Lead Data Engineer / Insight Global', { exact: true })).toBeVisible()
  await expect(dialog.getByRole('link', { name: 'Download résumé' })).toHaveAttribute('download', '')
  await expect(dialog.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/roushan-kumar-2453b0182/')
  await page.keyboard.press('Escape')
})

test('the gallery supports next, previous, keyboard navigation, and escape', async ({ page }) => {
  await page.goto('/cyber/')
  await page.getByRole('button', { name: 'Open gallery: The person behind the pipelines.', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByRole('heading', { name: 'The person behind the pipelines.' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Next gallery image' }).click()
  await expect(dialog.getByRole('heading', { name: 'A different perspective.' })).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByRole('heading', { name: 'Connected thinking.' })).toBeVisible()
  await dialog.getByRole('button', { name: 'Previous gallery image' }).click()
  await expect(dialog.getByRole('heading', { name: 'A different perspective.' })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
})

test('contact validates required fields and prepares an honest email draft', async ({ page }) => {
  await page.goto('/cyber/')
  await page.getByRole('button', { name: "Let's talk", exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByRole('button', { name: 'Prepare email' }).click()
  await expect(dialog.getByRole('link', { name: 'Open email draft' })).toHaveCount(0)
  await dialog.getByLabel('Your name').fill('Alex & Team')
  await dialog.getByLabel('Your email').fill('alex@example.com')
  await dialog.getByLabel('Company').fill('Data & Co')
  await dialog.getByLabel("What's on your mind?").fill('            ')
  await dialog.getByRole('button', { name: 'Prepare email' }).click()
  await expect(dialog.getByRole('link', { name: 'Open email draft' })).toHaveCount(0)
  await dialog.getByLabel("What's on your mind?").fill('I would love to discuss a lead data engineering role.')
  await dialog.getByRole('button', { name: 'Prepare email' }).click()
  await expect(dialog.getByText('Your draft is ready. It has not been sent.', { exact: true })).toBeVisible()
  const href = await dialog.getByRole('link', { name: 'Open email draft' }).getAttribute('href')
  expect(href).toMatch(/^mailto:rkkr901@gmail.com\?subject=/)
  const parameters = new URLSearchParams(href!.split('?')[1])
  expect(parameters.get('subject')).toBe("Let's connect - Data & Co")
  expect(parameters.get('body')).toContain('From: Alex & Team')
  expect(parameters.get('body')).toContain('alex@example.com')
  await dialog.getByLabel('Company').fill('Different company')
  await expect(dialog.getByRole('link', { name: 'Open email draft' })).toHaveCount(0)
})

test('email copying works and clipboard failure is visible', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/cyber/')
  await page.getByRole('button', { name: "Let's talk", exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Copy email', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('button', { name: 'Email copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('rkkr901@gmail.com')
  await page.getByRole('button', { name: 'Close dialog' }).click()
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => Promise.reject(new Error('Clipboard denied for test')) } })
  })
  await page.getByRole('button', { name: "Let's talk", exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Copy email', exact: true }).click()
  await expect(page.getByRole('dialog').getByRole('alert')).toContainText('Copy unavailable.')
})

test('system reduced motion is respected and all content remains accessible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const view of views) {
    await page.goto(view.path)
    await expect(page.getByRole('main')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('data-motion', 'paused')
    await expect(page.getByRole('button', { name: 'Enable animations', exact: true })).toBeVisible()
    const hiddenReveals = page.locator('.reveal[data-visible="false"]')
    await expect(hiddenReveals).toHaveCount(0)
  }
})

test('three layouts fit phone, tablet, laptop, and wide desktop screens', async ({ page }) => {
  for (const width of [320, 768, 1024, 1920]) {
    await page.setViewportSize({ width, height: 900 })
    for (const view of views) {
      await page.goto(view.path)
      await expect(page.getByRole('main')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), `${view.name} overflow at ${width}px`).toBe(true)
    }
  }
})

test('mobile cyber navigation opens, navigates, and closes', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Mobile navigation only')
  await page.goto('/cyber/')
  const trigger = page.getByRole('button', { name: 'Open navigation', exact: true })
  await trigger.click()
  await expect(page.getByRole('button', { name: 'Close navigation', exact: true })).toHaveAttribute('aria-expanded', 'true')
  await page.getByRole('navigation', { name: 'Main navigation' }).getByRole('link', { name: 'Gallery' }).click()
  await expect(page).toHaveURL(/#cyber-gallery$/)
  await expect(page.getByRole('button', { name: 'Open navigation', exact: true })).toHaveAttribute('aria-expanded', 'false')
})
