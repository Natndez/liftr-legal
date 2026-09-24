# Liftr legal pages

Static pages for the Terms of Use and Privacy Policy. This repo is private, so they're published from a separate public repo on GitHub Pages.

1. The support address is `dev.nathanf@gmail.com` for now: five spots across the three HTML files, plus `FEEDBACK_EMAIL` in `app/(tabs)/profile.tsx`. When it changes, change all of them and re-upload the pages.
2. Create a public repo named `liftr-legal` and copy `index.html`, `terms.html` and `privacy.html` to its root.
3. In that repo: Settings → Pages → Deploy from a branch → `main` / root.
4. The pages land at `https://natndez.github.io/liftr-legal/terms.html` and `.../privacy.html`, which is what `src/constants/legal.ts` points at. If the URL differs, update that file.
5. Put the privacy URL in App Store Connect (App Privacy → Privacy Policy URL) and the support URL/email on the listing.

If the Terms change in a way people should agree to again, bump `TERMS_VERSION` in `src/constants/legal.ts`: everyone on an older version sees the agree screen on their next launch.
