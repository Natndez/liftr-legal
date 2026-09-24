# Liftr website

The public site: landing page, Terms of Use and Privacy Policy. This repo is private, so it's published from a separate public repo (`liftr-legal`) on GitHub Pages.

Live at https://natndez.github.io/liftr-legal/

| File | What it is |
|---|---|
| `index.html` | Landing page: hero, features, invite link, privacy, FAQ |
| `terms.html` | Terms of Use |
| `privacy.html` | Privacy Policy |
| `styles.css` | Shared styles. Colours mirror `src/components/theme.ts` |
| `site.js` | Copy/share buttons, the "On this page" list, back to top. The pages read fine without it |
| `icon.png` | App icon at 512px: favicon, home-screen icon, link previews |

## Publishing

Upload all six files (not this README) to the root of the `liftr-legal` repo, replacing what's there: on github.com, "Add file" → "Upload files", drag them in, commit. Pages redeploys in a minute or two.

The app links straight to `terms.html` and `privacy.html` (`src/constants/legal.ts`), so keep those file names. App Store Connect uses `privacy.html` as the Privacy Policy URL and the site root as the Support URL.

## Things you'll change later

- **Legal text.** Edit the words inside `<article class="prose">` only. Section headings need their `id` (the sidebar and deep links use them, and the FAQ links to `privacy.html#who-can-see`). Update the "Effective" date at the top. If the Terms change in a way people should agree to again, bump `TERMS_VERSION` in `src/constants/legal.ts`: everyone on an older version sees the agree screen on their next launch.
- **Invite link.** `index.html` uses the TestFlight link in several places (buttons, the copy field, the message). When Liftr is on the App Store, find and replace `https://testflight.apple.com/join/AMtnvyBE` with the App Store link, and reword the "beta" / "TestFlight" copy and the "Joining takes a minute" steps.
- **Support email.** `dev.nathanf@gmail.com` for now: in `terms.html`, `privacy.html` and `index.html` (FAQ and footer), plus `FEEDBACK_EMAIL` in `app/(tabs)/profile.tsx`.
