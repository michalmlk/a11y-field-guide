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

This is a Vite + React 19 + TypeScript site for teaching web accessibility patterns.

### Routing
Uses `react-router` 7.15.0 in data mode. `app.tsx` defines routes via `createBrowserRouter` and renders `<RouterProvider>`. `Layout` is the root route with `<Outlet />`; nested routes render `Home`, `About`, and `ArticlePage`. Use `<Link to>` from `react-router` for in-app navigation, not plain `<a href>`.

### Key architectural patterns

**Demos are vanilla JS, not React.** Everything in `src/demos/` is plain JS + CSS. React mounts demos via `DemoShell`, which accepts a `mount(container: HTMLElement)` callback that returns an optional cleanup function. This keeps demos self-contained and framework-agnostic.

**Articles are MDX files, organized by locale.** `src/articles/index.ts` holds the metadata manifest (slug, WCAG criterion, tags) — the `ArticleMeta` type is defined in `src/components/ArticleCard.tsx`. Localized titles and descriptions live in `src/locales/<lang>/articles.json` keyed by slug. The `.mdx` files live under `src/articles/<lang>/<slug>.mdx`. `ArticlePage` lazy-loads them via `import.meta.glob('../articles/*/*.mdx')`, falls back to the `en` file when a localized variant is missing, and so **an `.mdx` file without a matching manifest entry is unreachable**. MDX is importable as React components via `@mdx-js/rollup` (configured in `vite.config.ts` — MDX plugin must come before the React plugin).

**Styling uses CSS Modules + global tokens.** Design tokens live in `src/tokens.css` and are imported by `src/index.css`. Components use `*.module.css` files co-located alongside them. No Tailwind, no CSS-in-JS.

**Code highlighting uses Shiki on two paths.** MDX code fences are highlighted at build time via `@shikijs/rehype` (configured in `vite.config.ts`). `CodeCompare` highlights its `bad`/`good` string props at runtime via `src/utils/shiki.ts`, which exposes a singleton `getHighlighter()` and a `highlight(code, lang)` helper. Both paths share the same theme + language list from `shiki.ts` — add new languages there. Shiki's dual-theme output is wired to `prefers-color-scheme` and `data-theme` in `tokens.css` (the `.shiki` selectors). Adding a new language requires updating `shikiLangs` *and* the dynamic `import('@shikijs/langs/...')` calls in `getHighlighter()`.

**Accessibility audit is opt-in.** `AuditPanel` runs `axe-core` on demand via `src/utils/run-axe.ts`. It is a floating panel — wire it into pages where live auditing is needed.

**Theme toggle** persists to `localStorage` and sets `data-theme` on `<html>`. Dark mode styles are currently handled via `@media (prefers-color-scheme: dark)` in `tokens.css`; the `data-theme` attribute is available for explicit overrides.

**i18n uses `i18next` + `react-i18next`** (initialized in `src/i18n.ts`, imported by `main.tsx` before render). Supported locales: `en` (default), `pl`. Resources are bundled JSON in `src/locales/<lang>/{common,articles}.json` (two namespaces). The `i18next-browser-languagedetector` reads `localStorage` (key `i18nextLng`) then `navigator.language`; `LanguageToggle` calls `i18n.changeLanguage(...)` to switch. `<html lang>` is synced to the active locale in `i18n.ts`. Add new UI strings to `common.json`. Article titles/descriptions go in `articles.json` keyed by slug.

**WCAG criterion metadata** lives in `src/utils/wcag-criteria.ts` as a `Record<string, WcagCriterion>` keyed by criterion ID (e.g. `"1.4.3"`). Each entry has `id`, `title`, `level` (`A`/`AA`/`AAA`), and a W3C `url`. Use this for lookups rather than hardcoding criterion details inline.

### Adding a new article

1. Add an entry to `src/articles/index.ts` with `slug`, `wcag` (criterion ID string, e.g. `"1.4.3"`), and `tags`.
2. Add `title` and `description` for the slug to every locale file under `src/locales/<lang>/articles.json`.
3. Create `src/articles/en/<slug>.mdx` with the content. Add localized variants at `src/articles/<lang>/<slug>.mdx`; missing locales fall back to `en`.

`ArticlePage` handles all articles generically — no changes to `app.tsx` are needed. Only add a new page under `src/pages/` and a route in `app.tsx` if the article requires a completely custom layout outside the standard article template.

**Pitfall:** an `.mdx` file without a matching manifest entry is silently unreachable — `ArticlePage` requires both the glob hit and the manifest entry. `src/articles/en/accessible-forms.mdx` is a current example of this orphaned state.

### Adding a new demo

1. Create `src/demos/<name>.js` with a **named export** following the `mount<Name>(container)` convention (e.g. `export function mountModalDemo(container)`). Return a cleanup function.
2. Create `src/demos/<name>.css` and import it inside the `.js` file.
3. Use `<DemoShell title="..." mount={mountFn} />` inside the relevant article/page.

`DemoShell` remounts whenever the `mount` prop reference changes (it's a `useEffect` dependency). Define the mount function **outside the component** or wrap it in `useCallback` — otherwise the demo remounts on every render.

### Available MDX components

`CodeCompare` renders a side-by-side inaccessible/accessible code diff. Import and use it inside `.mdx` files:

```tsx
import CodeCompare from '../components/CodeCompare'
<CodeCompare bad="..." good="..." lang="tsx" />
// optional: badLabel, goodLabel, lang (defaults to 'tsx')
```

`lang` must be one of the languages registered in `src/utils/shiki.ts`. Unknown values fall back to `js`.
