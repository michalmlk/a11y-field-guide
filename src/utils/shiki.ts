import type { HighlighterCore } from 'shiki/core'

export const shikiLangs = ['js', 'ts', 'jsx', 'tsx', 'html', 'css'] as const
export type ShikiLang = (typeof shikiLangs)[number]

export const shikiThemes = {
  light: 'github-light',
  dark: 'github-dark',
} as const

let highlighterPromise: Promise<HighlighterCore> | null = null

export function getHighlighter(): Promise<HighlighterCore> {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [{ createHighlighterCore }, { createOnigurumaEngine }] = await Promise.all([
        import('shiki/core'),
        import('shiki/engine/oniguruma'),
      ])
      return createHighlighterCore({
        themes: [
          import('@shikijs/themes/github-light'),
          import('@shikijs/themes/github-dark'),
        ],
        langs: [
          import('@shikijs/langs/javascript'),
          import('@shikijs/langs/typescript'),
          import('@shikijs/langs/jsx'),
          import('@shikijs/langs/tsx'),
          import('@shikijs/langs/html'),
          import('@shikijs/langs/css'),
        ],
        engine: createOnigurumaEngine(import('shiki/wasm')),
      })
    })()
  }
  return highlighterPromise
}

export async function highlight(code: string, lang: string): Promise<string> {
  const highlighter = await getHighlighter()
  const resolved = (shikiLangs as readonly string[]).includes(lang) ? lang : 'js'
  return highlighter.codeToHtml(code, {
    lang: resolved,
    themes: shikiThemes,
    defaultColor: false,
  })
}
