# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server
npm run build      # tsc -b && vite build
npm run lint       # eslint
npm run preview    # preview production build
```

No test runner is configured yet.

## Code style

Comment only genuinely complex code — omit comments for anything self-explanatory.

## Architecture

This is a Vite + React 19 + TypeScript site for teaching web accessibility patterns. There is **no router library** — `app.tsx` does manual pathname matching and renders the appropriate page component.

### Key architectural patterns

**Demos are vanilla JS, not React.** Everything in `src/demos/` is plain JS + CSS. React mounts demos via `DemoShell`, which accepts a `mount(container: HTMLElement)` callback that returns an optional cleanup function. This keeps demos self-contained and framework-agnostic.

**Articles are MDX files.** `src/articles/index.ts` holds the metadata manifest (slug, title, WCAG criterion, tags) — the `ArticleMeta` type is defined in `src/components/ArticleCard.tsx`. The `.mdx` files in the same directory are the actual content. `ArticlePage` lazy-loads them via `import.meta.glob('../articles/*.mdx')` keyed by slug, so **an `.mdx` file without a matching manifest entry is unreachable**. MDX is importable as React components via `@mdx-js/rollup` (configured in `vite.config.ts` — MDX plugin must come before the React plugin).

**Styling uses CSS Modules + global tokens.** Design tokens live in `src/tokens.css` and are imported by `src/index.css`. Components use `*.module.css` files co-located alongside them. No Tailwind, no CSS-in-JS.

**Accessibility audit is opt-in.** `AuditPanel` runs `axe-core` on demand via `src/utils/run-axe.ts`. It is a floating panel — wire it into pages where live auditing is needed.

**Theme toggle** persists to `localStorage` and sets `data-theme` on `<html>`. Dark mode styles are currently handled via `@media (prefers-color-scheme: dark)` in `tokens.css`; the `data-theme` attribute is available for explicit overrides.

**WCAG criterion metadata** lives in `src/utils/wcag-criteria.ts` as a `Record<string, WcagCriterion>` keyed by criterion ID (e.g. `"1.4.3"`). Each entry has `id`, `title`, `level` (`A`/`AA`/`AAA`), and a W3C `url`. Use this for lookups rather than hardcoding criterion details inline.

**Navigation uses plain `<a href>` links**, not a router `<Link>` component. This is intentional — there is no router library. Full-page navigations are fine; the app re-initialises on each route.

### Adding a new article

1. Add an entry to `src/articles/index.ts` (slug, title, description, WCAG id, tags).
2. Create `src/articles/<slug>.mdx` with the content.

`ArticlePage` handles all articles generically — no changes to `app.tsx` are needed. Only add a new page under `src/pages/` and a route in `app.tsx` if the article requires a completely custom layout outside the standard article template.

### Adding a new demo

1. Create `src/demos/<name>.js` exporting a `mount(container)` function that returns a cleanup.
2. Create `src/demos/<name>.css` and import it inside the `.js` file.
3. Use `<DemoShell title="..." mount={mountFn} />` inside the relevant article/page.

`DemoShell` remounts whenever the `mount` prop reference changes (it's a `useEffect` dependency). Define the mount function **outside the component** or wrap it in `useCallback` — otherwise the demo remounts on every render.
