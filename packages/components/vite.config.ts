import { resolve } from 'node:path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const rootDir = import.meta.dirname

const external = (id: string): boolean => {
  if (id === 'react' || id === 'react-dom' || id === 'react/jsx-runtime') return true
  if (id.startsWith('react-dom/')) return true
  if (id === 'antd' || id.startsWith('antd/')) return true
  if (id.startsWith('@formvk/')) return true
  if (id.startsWith('@ant-design/')) return true
  if (id.startsWith('@dnd-kit/')) return true
  if (id === 'classnames' || id.startsWith('classnames/')) return true
  if (id === 'dayjs' || id.startsWith('dayjs/')) return true
  if (id === 'react-sticky-box' || id.startsWith('react-sticky-box/')) return true
  return false
}

export default defineConfig({
  plugins: [
    react(),
    dts({
      tsconfigPath: './tsconfig.build.json',
      entryRoot: 'src',
      bundleTypes: true,
    }),
  ],
  build: {
    target: 'es2022',
    sourcemap: true,
    minify: false,
    lib: {
      entry: resolve(rootDir, 'src/index.ts'),
      formats: ['es'],
      fileName: 'index.js',
    },
    rollupOptions: {
      external,
      output: {
        preserveModules: false,
      },
    },
  },
})
