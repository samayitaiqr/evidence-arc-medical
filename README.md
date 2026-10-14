# Evidence Arc Medical Affairs

The existing Evidence Arc design, prepared for hosting independently of ChatGPT and editing through **Pages CMS**.

## What is ready

- The current website design, colours, animations and content.
- Editing forms for 13 content sections, including services and contact details.
- Image uploads for a logo, homepage image, expertise image and service/case images.
- Add, remove and reorder service cards and other repeated content.
- A static build with no third-party runtime or package dependencies.
- A GitHub check that tests and builds changes.
- An `/admin/` page linking to the content editor.

The Pages CMS configuration is supplied in `.pages.yml`. Routine editors do not need to open or change that file.

## Website and editor links

- **Current live website:** [Evidence Arc](https://evidence-arc-medical.aprameyo.chatgpt.site/). This is the original ChatGPT-hosted version.
- **Content editor:** [Open Pages CMS](https://app.pagescms.org/), sign in with GitHub and select `samayitaiqr/evidence-arc-medical` on `main`.
- **Independent website hosting:** Cloudflare Pages still needs to be connected to this repository using the settings below. The new live URL will be returned by Cloudflare after the first successful deployment.

This repository contains the prepared, locally checked website. Pages CMS authorization and Cloudflare hosting must be connected before browser edits can update a live website. The original ChatGPT-hosted website is separate and has not been changed by this export.

## One-time setup

### 1. Put the project in GitHub

The target repository is [`samayitaiqr/evidence-arc-medical`](https://github.com/samayitaiqr/evidence-arc-medical). A **private repository** is suitable: the website can be public while its source remains private.

Upload or push this complete project with `.pages.yml` at the repository root, on the `main` branch. Keep the `content`, `templates`, `public` and `scripts` folders together. The `dist` directory is generated during publishing and need not be committed.

### 2. Enable the editor

1. Open [Pages CMS](https://app.pagescms.org/).
2. Sign in using the GitHub account that owns the repository.
3. Install/authorize the Pages CMS GitHub App for **only this repository**.
4. Open `evidence-arc-medical`, selecting `main`.

The editor will read the supplied configuration and show the content sections automatically. You do not need to create a new configuration or write code.

### 3. Connect hosting

Create a **Cloudflare Pages** project using its Git integration, and authorize access to the Evidence Arc repository. Select these settings:

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Framework preset | None |
| Build command | `npm test && npm run build` |
| Build output directory | `dist` |
| Root directory | Repository root |
| Node version | 24 (also specified in `.node-version`) |

Deploy the project. Cloudflare provides a `pages.dev` address, and later you can attach a purchased domain through its custom-domain settings.

Once the final address is known, open **Brand and website settings** in Pages CMS, fill in **Website url**, and save. Leaving it blank during setup lets Cloudflare supply the deployment address. No domain purchase is needed to test the website.

The GitHub repository is used for source storage and editing. This project is configured for Cloudflare hosting rather than GitHub Pages.

## Your everyday editing workflow

1. Open Pages CMS, or visit `/admin/` on your published website.
2. Select the repository and `main` branch.
3. Choose a section such as **Services**, **Contact details** or **Homepage introduction**.
4. Change text, reorder cards, or choose an uploaded image.
5. Select **Save**. Pages CMS commits the changes to GitHub.
6. Cloudflare builds and publishes the update. Check the live website when the deployment succeeds.

Saving on `main` starts publication when the Git integration is connected. For a change you want to review before publishing, use a separate branch and its preview, then merge it when ready.

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

## References

- [Pages CMS setup](https://pagescms.org/docs/quick-start/)
- [Pages CMS configuration](https://pagescms.org/docs/configuration/)
- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/configuration/git-integration/)
- [Cloudflare static HTML hosting](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/)

