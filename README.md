# Evidence Arc Medical Affairs

**[Open the live Evidence Arc website](https://samayitaiqr.github.io/evidence-arc-medical/)**

The existing Evidence Arc design, hosted free on GitHub Pages with content editing configured for **Pages CMS**.

## What is ready

- The current website design, colours, animations and content.
- Editing forms for 13 content sections, including services and contact details.
- Image uploads for a logo, homepage image, expertise image and service/case images.
- Add, remove and reorder service cards and other repeated content.
- A static build with no third-party runtime or package dependencies.
- GitHub Actions that test, build and automatically publish changes to GitHub Pages.
- An `/admin/` page linking to the content editor.

The Pages CMS configuration is supplied in `.pages.yml`. Routine editors do not need to open or change that file.

## Website and editor links

- **Live website:** [Evidence Arc on GitHub Pages](https://samayitaiqr.github.io/evidence-arc-medical/).
- **Content editor:** [Open Pages CMS](https://app.pagescms.org/), sign in with GitHub and select `samayitaiqr/evidence-arc-medical` on `main`.
- **Original website:** [ChatGPT-hosted version](https://evidence-arc-medical.aprameyo.chatgpt.site/). This is a separate copy and is not updated by changes here.

The repository is **public**, GitHub Pages is enabled with **GitHub Actions** as its source, and the first deployment succeeded. The site uses GitHub's free address with HTTPS. The website files, source and commit history are publicly visible.

## Enable the content editor on your first visit

1. Open [Pages CMS](https://app.pagescms.org/).
2. Sign in using the GitHub account that owns the repository.
3. Install/authorize the Pages CMS GitHub App for **only this repository**.
4. Open `evidence-arc-medical`, selecting `main`.

The editor configuration is ready, but Pages CMS account authorization still needs to be completed. After authorization, the editor reads the supplied configuration and shows the content sections automatically. You do not need to write code for these content changes.

## Hosting

The workflow `.github/workflows/pages.yml` tests the site, builds `dist`, and publishes the generated website whenever `main` changes. It gets the correct base address from GitHub so images and navigation work under the repository path. No domain purchase is needed.

Leave **Website url** blank in Pages CMS while using the GitHub-assigned address. To use a purchased domain later, configure it in **Settings → Pages**, then enter that address in **Brand and website settings**.

To republish manually, open **Actions → Publish website to GitHub Pages → Run workflow**, selecting `main`. Deployment status and the **Visit site** link are also available under **Settings → Pages**. GitHub's hosting usage limits apply.

## Your everyday editing workflow

1. Open Pages CMS, or visit `/admin/` on your published website.
2. Select the repository and `main` branch.
3. Choose a section such as **Services**, **Contact details** or **Homepage introduction**.
4. Change text, reorder cards, or choose an uploaded image.
5. Select **Save**. Pages CMS commits the changes to GitHub.
6. GitHub Actions builds and publishes the update. Check the live website when the deployment succeeds.

Saving on `main` starts publication. For a change you want to review before publishing, use a separate branch and merge it when ready.

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
