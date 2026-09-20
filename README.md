# Roushan Kumar - three portfolio worlds

Three complete, original portfolio experiences built from the supplied September 2026 resume and LinkedIn reference. Each has its own HTML entry and URL; they share verified content, local assets, a resume download, and accessible contact/project dialogs.

| Experience | Local URL | Direction |
| --- | --- | --- |
| **Roushan's World** | http://127.0.0.1:5173/ | The welcome page: an original brick-built platform adventure with keyboard/touch controls and a non-game portfolio. |
| **Cyber** | http://127.0.0.1:5173/cyber/ | Dark data universe, interactive 3D canvas illustration, filterable case studies, career timeline, and portrait/art gallery. |
| **Studio** | http://127.0.0.1:5173/studio/ | An editorial CV with a large portrait, circular navigation, thoughtful hover effects, and scroll reveals. |

The persistent bottom switcher opens the other websites. Its pause button controls decorative motion; the system's reduced-motion preference is respected by default. Older `/play/` links redirect to the welcome page, preserving query strings and section links. Initial section links scroll into view after the selected portfolio and its fonts finish loading.

Mobile layouts use a shared reading scale: at least 16px for body copy, 14px for controls, and 12px for secondary labels, with generous line spacing and touch targets. The Cyber gallery pairs one personal portrait with two original system illustrations; the formal portrait stays in the separate About section.

## GitHub Pages addresses

- **Welcome / Roushan's World:** https://roushan1101.github.io/
- **Cyber:** https://roushan1101.github.io/cyber/
- **Studio:** https://roushan1101.github.io/studio/
- **Source repository:** https://github.com/Roushan1101/Roushan1101.github.io
- **Deployment status:** https://github.com/Roushan1101/Roushan1101.github.io/actions/workflows/deploy-pages.yml

The public addresses become available after the Pages deployment succeeds.

## Run locally

Requires Node.js 22.12+ (Node.js 24 is supported) and npm.

```powershell
Set-Location 'F:\code\My portal'
npm install
npm run dev
```

Open one of the local URLs above. No API keys, accounts, database, or environment variables are needed. Fonts and artwork are served locally; the websites do not depend on external image or font services.

## Build and verify

```powershell
npm run lint
npm test
npm run build
npm run test:e2e
```

`build` runs TypeScript checking and produces `dist`. The browser suite starts and stops its own **production preview** on port 4173 and tests desktop and mobile layouts. If Playwright reports a missing Chromium binary, install it once with:

```powershell
npx playwright install chromium
```

To inspect a production build manually:

```powershell
npm run preview
```

That command uses http://127.0.0.1:4173/; do not run it concurrently with the browser suite.

If port 4173 is already used by another process, leave that process alone and choose a free test port:

```powershell
$env:PLAYWRIGHT_PORT = '4187'
npm run test:e2e
Remove-Item Env:PLAYWRIGHT_PORT
```

## Playing Roushan's World

- Choose **Let's play** for manual controls or **Watch a tour** for an automatic adventure.
- Move with **Left/Right** or **A/D**. Jump with **Space**, **Up**, or **W**.
- On phones and tablets, hold the large on-screen direction and jump buttons.
- Use **P**, **Escape**, or **Pause** to take a break. Resume and restart are always available.
- Collect data tokens and visit four career landmarks. There are no enemies, timers, or penalties.
- The world pauses when you leave the game, switch tabs, or open a project. Inputs are cleared so a key cannot stay stuck.
- **Take the controls** switches a tour into manual play.
- **Skip game / View portfolio** and the case-study buttons work immediately; no score or unlock is required.
- Progress is just for the current visit, not stored as a persistent high score.

## Publish, then add it to your resume

Localhost links work only on your computer. Use `https://roushan1101.github.io/` in your resume once the deployment workflow succeeds. The GitHub Pages workflow below handles publishing; the following steps also support a different static host.

1. Run `npm run build`.
2. Deploy **the contents of `dist`** to a static host such as Netlify, Vercel, Cloudflare Pages, or your own web server.
   - Build command: `npm run build`
   - Output directory: `dist`
   - No backend, server secrets, or SPA catch-all rewrite is required.
   - Keep the `cyber/index.html`, `studio/index.html`, and legacy `play/index.html` directories intact so direct links and refreshes work.
3. Connect a custom domain if desired.
4. Verify the three public URLs, resume download, mobile layout, and contact links.
5. Add your chosen public URL to the resume's contact header.

Copy-ready resume links for this GitHub Pages deployment:

```text
Portfolio: https://roushan1101.github.io/
Professional CV: https://roushan1101.github.io/studio/
Cyber portfolio: https://roushan1101.github.io/cyber/
```

Use the root address as the primary link in the resume header: Roushan's World is the welcome experience. Studio remains available as a conventional recruiter-facing CV, and Cyber showcases personality and projects.

An optional project entry you can adapt:

> Personal Portfolio - Designed and built a responsive React and TypeScript portfolio with three distinct experiences, interactive data visualizations, accessible project case studies, and an original keyboard/touch-controlled platform game. Added automated unit and browser tests.

### GitHub Pages deployment

The included [deployment workflow](.github/workflows/deploy-pages.yml) runs on pushes to `main` and can also be started manually from the Actions tab.

1. Create a public repository in the intended GitHub account. A repository named `USERNAME.github.io` gives the root address `https://USERNAME.github.io/`.
2. Under **Settings > Pages > Build and deployment**, choose **GitHub Actions** as the source.
3. Push the approved website source to `main`. Do not upload the original reference PDFs from the project root; Git ignores these while retaining the intended `public/resume` download.
4. The workflow installs locked dependencies, runs lint/unit/browser checks, derives the correct Pages base path, and deploys only `dist`.
5. Wait for **Verify and deploy portfolio** to finish successfully before sharing the public link. If Pages was enabled after the initial push, use **Actions > Verify and deploy portfolio > Run workflow**.

The workflow uses SHA-pinned official GitHub actions and the repository-provided `GITHUB_TOKEN`; no personal access token or external hosting secret is needed in the repository. Only the deployment job receives Pages-write and OIDC permissions.

### Hosting in a subdirectory

For a URL such as `https://YOUR-DOMAIN/my-portal/`, set Vite's base path when building:

```powershell
$env:BASE_PATH = '/my-portal/'
npm run build
Remove-Item Env:BASE_PATH
```

Deploy the contents of `dist` under that directory. Shared asset, resume, and experience links use the configured base. The default test suite expects the default root base `/`.

## Update your content

- [src/data/profile.ts](src/data/profile.ts): name, contact details, current role, career dates, four case studies, metrics, skills, certifications, education, and recognition.
- [public/resume/Roushan-Kumar-Resume.pdf](public/resume/Roushan-Kumar-Resume.pdf): the actual downloadable resume. Replace this file when updating it, keeping the name or updating `profile.resumeUrl`.
- [public/assets/roushan.webp](public/assets/roushan.webp): formal portrait extracted from the supplied resume and optimized to 36 KB.
- [public/assets/roushan-outdoors.webp](public/assets/roushan-outdoors.webp): the owner's portrait extracted from the supplied LinkedIn reference and optimized to 29 KB.
- [src/themes/cyber](src/themes/cyber), [src/themes/studio](src/themes/studio), and [src/themes/play](src/themes/play): independent page designs.
- [src/styles/global.css](src/styles/global.css): shared reset, fonts, accessibility, dialogs, and experience switcher.
- [src/styles/mobile.css](src/styles/mobile.css): the shared mobile typography and touch-layout layer, keeping phone text readable without changing desktop typography.
- The three portfolio HTML entries contain their own SEO titles, descriptions, theme colors, and JavaScript-free resume/contact fallback. The additional `play/index.html` entry only redirects old links to the welcome page.

Run the checks again after making changes. No edits are made to the original source PDFs in the project root.

## Contact behavior

The contact dialog intentionally **does not pretend to send email**.

- Direct email and telephone links open the visitor's configured apps.
- Copy email uses the Clipboard API and displays an explicit message if permission is unavailable.
- The form validates input and prepares an encoded `mailto:` draft. The visitor then opens their email app, reviews it, and sends it themselves.
- Preparing a draft is not a delivery confirmation. If no email app is configured, the email address remains available to copy.
- No contact messages are stored or submitted to an external service.

For a server-delivered contact form later, connect an authenticated backend or your chosen form service and add real delivery/error handling rather than displaying a simulated success message.

## Source fidelity and privacy

- The dated resume is the authority for employment titles, dates, education, and achievement metrics. The LinkedIn screenshots contain some conflicting role dates, so they have not been merged into the resume timeline.
- Employer and client relationships are explicit: Insight Global / CCC, Insight Global / T-Mobile, and MAQ Software / Microsoft client work.
- The four project stories are **experience-based case studies**, not claims of publicly available software. Their diagrams are original conceptual visuals, not screenshots or data from client systems.
- Metrics are attributed to the relevant work: up to 200 million rows, 50% less operational time, 30% processing efficiency improvement, and 40% less update time.
- Databricks credential ID `130445583` appears in both sources. The portal uses the Databricks issuer shown in the LinkedIn reference. Conflicting issue dates are deliberately omitted. The supplied resume lists DP-600 without a date, so none is invented.
- No GitHub account, public demos, testimonials, extra qualifications, or travel history have been invented.
- The provided professional contact details and resume are intentionally downloadable. Review them before making the site public; the PDF also contains the supplied phone number.
- The LinkedIn reference PDF includes private interface details and other people's information. It is **not** included in `public` or the production build.
- Only deploy `dist`, not the entire source folder.
- No analytics, cookies, tracking pixels, or third-party contact service are included.

## Design and implementation

The supplied DAQ reference informed the dark, immersive data/AI direction. The Wix Creative CV reference informed Studio's spacious portrait-and-circular-navigation language, with restrained Apple-inspired transitions. The game uses original graphics and an original character, borrowing only the general idea of playful building blocks and easy platform exploration. No proprietary site code, branded game characters, or third-party game sprites are used.

Stack: React, TypeScript, Vite multi-page builds, original Canvas/SVG/CSS artwork, locally bundled open-source fonts, and Lucide icons. Tests use Vitest and Playwright. The source PDF extraction is already complete; Python and PDF tools are not needed to run or build the websites.
