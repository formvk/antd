import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin/markdown'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

const reactDependencies = {
  '@formvk/antd': '^1.0.0',
  '@formvk/react': '^1.1.1',
  antd: '^6.0.0',
  dayjs: '^1.11.0',
  react: '^19.0.0',
  'react-dom': '^19.0.0',
}

const reactPackageJson = (options: { scripts?: Record<string, string>; vite?: boolean } = {}) =>
  JSON.stringify(
    {
      version: '0.0.0',
      private: true,
      ...(options.scripts ? { scripts: options.scripts } : {}),
      dependencies: reactDependencies,
      devDependencies: {
        '@types/react': 'latest',
        '@types/react-dom': 'latest',
        typescript: 'latest',
        ...(options.vite ? { '@vitejs/plugin-react': 'latest', vite: 'latest' } : {}),
      },
    },
    null,
    2
  )

const reactViteConfig = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`

const reactSandboxFiles = {
  'package.json': reactPackageJson({
    scripts: {
      dev: 'vite',
      build: 'vite build',
      serve: 'vite preview',
    },
    vite: true,
  }),
  'vite.config.js': reactViteConfig,
}

export default defineConfig({
  lang: 'zh-CN',
  title: '@formvk/antd',
  description: 'Formvk 的 Ant Design v6 组件桥接层',
  lastUpdated: true,
  cleanUrls: true,
  markdown: {
    config(md) {
      md.use(vitepressDemoPlugin, {
        tab: {
          order: 'react',
        },
        stackblitz: {
          show: true,
          templates: [{ scope: 'react', files: reactSandboxFiles }],
        },
        codesandbox: {
          show: true,
          templates: [{ scope: 'react', files: reactSandboxFiles }],
        },
      })
    },
  },
  vite: {
    esbuild: {
      jsx: 'automatic',
    },
    resolve: {
      alias: {
        '@formvk/antd': path.resolve(rootDir, 'packages/components/src/index.ts'),
      },
      dedupe: ['react', 'react-dom'],
    },
  },
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/install' },
      { text: '组件', link: '/components/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '指南',
          items: [
            { text: '安装', link: '/guide/install' },
            { text: '快速开始', link: '/guide/quick-start' },
            { text: 'Schema 写法', link: '/guide/schema' },
            { text: '布局', link: '/guide/layout' },
            { text: '数组组件', link: '/guide/array' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '总览', link: '/components/' },
            { text: '表单与布局', link: '/components/form' },
            { text: '基础字段', link: '/components/fields' },
            { text: '数组组件', link: '/components/array' },
            { text: '高级组件', link: '/components/advanced' },
          ],
        },
      ],
    },
    search: {
      provider: 'local',
    },
    outline: {
      level: [2, 3],
      label: '本页目录',
    },
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    lastUpdatedText: '最后更新',
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
  },
})
