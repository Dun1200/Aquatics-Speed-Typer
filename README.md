# Poolside Typing Sprint

A small, static typing game for a shared training computer. It uses plain HTML, CSS, and JavaScript; there is no build step, server, login, or data collection.

## Run it locally

Open `index.html` in a current desktop browser. The game remembers a few recently used facts in that browser so consecutive rounds are less likely to repeat. No names or typing results are saved or sent anywhere.

## Publish with GitHub Pages

The workflow in `.github/workflows/deploy-pages.yml` publishes the site whenever a commit is pushed to `main`, and can also be started manually from the repository's Actions tab.

1. Create a GitHub repository and add these files to its `main` branch.
2. In the repository, open **Settings → Pages** and select **GitHub Actions** as the build and deployment source.
3. Open **Actions** and allow the Pages deployment workflow if GitHub asks.
4. After the workflow finishes, find the live URL under **Settings → Pages** or in the workflow's deployment summary.

The workflow packages only `index.html`, `styles.css`, and `app.js`, so the existing training-artifact folders in this workspace are not published.

## Notes

- This is designed for desktop and laptop screens.
- The page requests DM Sans and Manrope from Google Fonts; if the font service is unavailable, it falls back to system fonts.
- Update the aquatic fact text in `app.js`. Keep the prompt title and passage text together in the same fact entry.
