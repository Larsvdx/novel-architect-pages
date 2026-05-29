# Novel Architect Pages

Static GitHub Pages site for Novel Architect, the desktop writing workspace for planning, drafting, revising, and reviewing long-form fiction.

## Site Goals

- Present Novel Architect as a professional, local-first desktop app for novel writers.
- Feature the slogan: "AI as a tool, not the author."
- Explain the main AI workflows: writing assistance, revision assistance, and the reviewer.
- Explain the context library and how it helps both the writer and AI requests.
- Communicate offline use and local data storage clearly.
- Link visitors to the latest GitHub releases hosted in `Larsvdx/novel-architect-releases`.

## Pages

- `index.html` - homepage with positioning, slogan, CTAs, and core product benefits.
- `features.html` - detailed feature overview for library, chapters, context, AI, spellcheck, PDF export, and offline access.
- `ai-workflow.html` - dedicated AI workflow explanation for chapter drafting, revision passes, and editorial reviews.
- `screenshots.html` - styled placeholder screenshot gallery for app workflows.
- `privacy.html` - local data, offline access, and AI request data overview.
- `download.html` - latest-release download page with GitHub release asset integration.

## Assets

- `assets/icon_final_2.png` - app icon copied from the desktop app repository.
- `assets/styles.css` - shared styling based on the desktop app theme: deep navy surfaces, purple primary accent, teal secondary accent, soft white text, and restrained panel styling.
- `assets/script.js` - mobile navigation plus latest-release lookup through the public GitHub releases API.

## Release Links

The primary release URL is:

```text
https://github.com/Larsvdx/novel-architect-releases/releases/latest
```

The download page calls:

```text
https://api.github.com/repos/Larsvdx/novel-architect-releases/releases/latest
```

If the API request fails or is rate-limited, the page falls back to the latest-release URL.

## Local Preview

Open `index.html` directly in a browser. No build step or local server is required.

## GitHub Pages

This site is designed to be served directly from the repository root. The `.nojekyll` file disables Jekyll processing.

## Replacing Screenshot Placeholders

The screenshots page currently uses styled HTML/CSS placeholders. When real application screenshots are ready, replace each placeholder block with an image while keeping the surrounding headings and copy if they still match the product.
