import { expect, test, type Page } from '@playwright/test'

const views = [
  {
    name: 'Play',
    path: '/',
    body: '.play-intro-note p, .play-about-copy > p, .play-project-copy > p, .play-experience-summary, .play-experience-highlights li, .play-instructions',
    controls: '.play-button, .play-tour-button, .play-direction-button, .play-navigation a, .play-intro-skip',
    menu: '',
  },
  {
    name: 'Cyber',
    path: '/cyber/',
    body: '.cyber-hero-description, .cyber-section-heading > p, .project-summary, .cyber-about-copy > p:not(.cyber-eyebrow), .cyber-career-content > p, .cyber-career-content li',
    controls: '.cyber-button, .cyber-resume-link, .cyber-work-filter button, .core-mode-controls button, .cyber-menu-toggle',
    menu: '.cyber-menu-toggle',
  },
  {
    name: 'Studio',
    path: '/studio/',
    body: '.studio-intro p, .studio-section-aside p, .studio-project-summary, .studio-resume-description, .studio-role-summary, .studio-role-content li, .studio-about-text',
    controls: '.studio-circle, .studio-menu-toggle, .studio-project-button, .studio-recruiter-link',
    menu: '.studio-menu-toggle',
  },
]

async function textIssues(page: Page, scope = 'body') {
  return page.locator(scope).evaluate((root) => {
    const small = new Set<string>()
    const clipped = new Set<string>()
    for (const element of root.querySelectorAll('*')) {
      if (!(element instanceof HTMLElement) || element.closest('svg, canvas, script, style, [aria-hidden="true"], .sr-only, .skip-link')) continue
      const nodes = [...element.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())
      if (!nodes.length || !element.getClientRects().length) continue
      const description = element.className || element.tagName.toLowerCase()
      const size = parseFloat(getComputedStyle(element).fontSize)
      if (size < 12) small.add(`${description}: ${size}px`)
      for (const node of nodes) {
        const range = document.createRange()
        range.selectNode(node)
        for (const rect of range.getClientRects()) {
          if (rect.width && (rect.left < -1 || rect.right > window.innerWidth + 1)) {
            clipped.add(`${description}: ${node.textContent?.trim().slice(0, 40)}`)
          }
        }
      }
    }
    return { small: [...small], clipped: [...clipped] }
  })
}

async function expectBodyText(page: Page, selector: string) {
  const sizes = await page.locator(selector).evaluateAll((elements) => elements
    .filter((element) => element.getClientRects().length)
    .map((element) => parseFloat(getComputedStyle(element).fontSize)))
  expect(sizes.length).toBeGreaterThan(0)
  for (const size of sizes) expect(size).toBeGreaterThanOrEqual(16)
}

for (const width of [320, 390, 768, 960]) {
  test(`mobile text is readable and unclipped at ${width}px`, async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', 'Phone and touch-tablet typography')
    await page.setViewportSize({ width, height: 844 })
    await page.emulateMedia({ reducedMotion: 'reduce' })
    for (const view of views) {
      await page.goto(view.path)
      await expect(page.getByRole('main')).toBeVisible()
      await page.evaluate(() => document.fonts.ready)
      await expectBodyText(page, view.body)
      expect(await textIssues(page), `${view.name} text at ${width}px`).toEqual({ small: [], clipped: [] })
      const controls = await page.locator(`${view.controls}, .experience-dock nav a`).evaluateAll((elements) => elements
        .filter((element) => element.getClientRects().length)
        .map((element) => ({
          name: element.getAttribute('aria-label') || element.textContent?.trim(),
          font: parseFloat(getComputedStyle(element).fontSize),
          height: element.getBoundingClientRect().height,
        })))
      for (const control of controls) {
        expect(control.font, `${view.name}: ${control.name}`).toBeGreaterThanOrEqual(14)
        expect(control.height, `${view.name}: ${control.name}`).toBeGreaterThanOrEqual(43.9)
      }
      if (view.menu && await page.locator(view.menu).isVisible()) {
        await page.locator(view.menu).click()
        expect(await textIssues(page), `${view.name} open menu`).toEqual({ small: [], clipped: [] })
        await page.keyboard.press('Escape')
      }
    }
  })
}

test('mobile forms and case studies use readable text and full-size inputs', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'mobile', 'Phone forms and dialogs')
  await page.setViewportSize({ width: 320, height: 740 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await page.getByRole('button', { name: /^Let.s talk$/ }).click()
  await expect(page.getByRole('dialog')).toBeVisible()
  const inputSizes = await page.locator('.contact-form input, .contact-form textarea').evaluateAll((elements) =>
    elements.map((element) => parseFloat(getComputedStyle(element).fontSize)))
  expect(inputSizes.length).toBeGreaterThan(0)
  for (const size of inputSizes) expect(size).toBeGreaterThanOrEqual(16)
  expect(await textIssues(page, '.portfolio-dialog')).toEqual({ small: [], clipped: [] })
  await page.keyboard.press('Escape')
  await page.goto('/cyber/')
  await page.getByRole('button', { name: 'Explore Healthcare, connected.', exact: true }).click()
  await expectBodyText(page, '.case-section p, .case-section li')
  expect(await textIssues(page, '.portfolio-dialog')).toEqual({ small: [], clipped: [] })
  await page.keyboard.press('Escape')
  await page.getByRole('button', { name: /Short on time/ }).click()
  expect(await textIssues(page, '.portfolio-dialog')).toEqual({ small: [], clipped: [] })
})
