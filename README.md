# Evidence Arc Medical Affairs

The existing Evidence Arc design, prepared for hosting independently of ChatGPT and editing through **Pages CMS**.

## What is ready

- The current website design, colours, animations and content.
- Editing forms for 13 content sections, including services and contact details.
- Image uploads for a logo, homepage image, expertise image and service/case images.
- Add, remove and reorder service cards and other repeated content.
- A static build with no third-party runtime or package dependencies.
- GitHub Actions that test, build and publish changes to GitHub Pages once Pages is enabled.
- An `/admin/` page linking to the content editor.

The Pages CMS configuration is supplied in `.pages.yml`. Routine editors do not need to open or change that file.

## Website and editor links

- **Current live website:** [Evidence Arc](https://evidence-arc-medical.aprameyo.chatgpt.site/). This is the original ChatGPT-hosted version.
- **Content editor:** [Open Pages CMS](https://app.pagescms.org/), sign in with GitHub and select `samayitaiqr/evidence-arc-medical` on `main`.
- **GitHub Pages publishing:** prepared in `.github/workflows/pages.yml`; activation in repository settings is still required. Use the **Visit site** link in GitHub's Pages settings after a successful deployment.

This repository contains the prepared, locally checked website. Pages CMS authorization and GitHub Pages activation must be completed before browser edits can update a live website. The original ChatGPT-hosted website is separate and has not been changed by this export.

## One-time setup

### 1. Put the project in GitHub

The project is uploaded to [`samayitaiqr/evidence-arc-medical`](https://github.com/samayitaiqr/evidence-arc-medical). It is currently **private**. GitHub Pages from a private personal repository requires GitHub Pro; GitHub Free requires a public repository. Changing repository visibility also exposes its source and history, so it is a separate owner decision.

Upload or push this complete project with `.pages.yml` at the repository root, on the `main` branch. Keep the `content`, `templates`, `public` and `scripts` folders together. The `dist` directory is generated during publishing and need not be committed.

### 2. Enable the editor

1. Open [Pages CMS](https://app.pagescms.org/).
2. Sign in using the GitHub account that owns the repository.
3. Install/authorize the Pages CMS GitHub App for **only this repository**.
4. Open `evidence-arc-medical`, selecting `main`.

The editor will read the supplied configuration and show the content sections automatically. You do not need to create a new configuration or write code.

### 3. Enable GitHub Pages

1. Open this repository's **Settings → Pages**.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**.
3. Open **Actions → Publish website to GitHub Pages → Run workflow**, selecting `main`.
4. Wait for the build and deployment to succeed, then use **Visit site** in the Pages settings.

If GitHub asks for an upgrade, the current plan does not support Pages from this private repository. The owner must choose whether to use GitHub Pro or make the source repository public before Pages can be activated.

The supplied workflow tests the site, builds `dist`, and publishes only the generated website. It also takes the site's correct base address from GitHub so images and navigation work under the repository path. No domain purchase is needed.

Leave **Website url** blank in Pages CMS while using the GitHub-assigned address. To use a purchased domain later, first configure it in **Settings → Pages**, then enter that address in **Brand and website settings**. GitHub's hosting usage limits apply; review its restrictions before using Pages for commercial transactions or an online business.

## Your everyday editing workflow

1. Open Pages CMS, or visit `/admin/` on your published website.
2. Select the repository and `main` branch.
3. Choose a section such as **Services**, **Contact details** or **Homepage introduction**.
4. Change text, reorder cards, or choose an uploaded image.
5. Select **Save**. Pages CMS commits the changes to GitHub.
6. GitHub Actions builds and publishes the update. Check the live website when the deployment succeeds.

Saving on `main` starts publication when GitHub Pages is enabled. For a change you want to review before publishing, use a separate branch and merge it when ready.

### Images

Use the image picker in a content section to upload and select an image. Uploading a file to the media library alone does not place it on the website. Give visible images a short description for screen readers.

The homepage image is optional. Leaving it empty keeps the existing four-stage diagram. Leaving the logo field empty keeps the existing arc symbol. The social image is used when sharing the website link.

Do not delete an image that a content section still uses. The build checks referenced images and reports a missing file instead of publishing a broken page.

### What still needs a developer

These forms edit content within the existing design. New page layouts, new features, changes to CSS and new types of section still require development.

## Local development

Requires Node.js 22 or newer; Node 24 is configured for deployment. There are no packages to install.

```sh
npm test
npm run build
```

Serve the generated `dist` folder with a static web server to preview. Never put access tokens, passwords or private keys in content files or this repository.

## File layout

- `content/*.json`: editable website content.
- `.pages.yml`: forms, field labels and image upload configuration.
- `templates/`: website markup and fixed icon artwork.
- `public/`: stylesheet, browser interactions and image files.
- `scripts/build.mjs`: generates the static website and metadata.
- `test/site.test.mjs`: content editing, independence and input validation checks.
- `.github/workflows/validate.yml`: GitHub checks on pushes and pull requests.
- `.github/workflows/pages.yml`: GitHub Pages publication on pushes to `main` or manual runs.

## References

- [Pages CMS setup](https://pagescms.org/docs/quick-start/)
- [Pages CMS configuration](https://pagescms.org/docs/configuration/)
- [GitHub Pages setup](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub Pages usage limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)
