import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import { shikiLangs, shikiThemes } from './src/utils/shiki'

export default defineConfig({
  plugins: [
    mdx({
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: shikiThemes,
            defaultColor: false,
            langs: [...shikiLangs],
            fallbackLanguage: 'text',
          },
        ],
      ],
    }),
    react(),
  ],
})
