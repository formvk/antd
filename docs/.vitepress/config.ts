import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin/markdown'

const rootDir = fileURLToPath(new URL('../..', import.meta.url))

const readJson = <T>(file: string) => JSON.parse(readFileSync(path.join(rootDir, file), 'utf8')) as T

const componentManifest = readJson<{
  version: string
  dependencies: Record<string, string>
}>('packages/components/package.json')
const rootManifest = readJson<{ devDependencies: Record<string, string> }>('package.json')

// GitHub Pages 项目站点部署在 /antd/ 子路径下，CI 通过 DOCS_BASE 注入；
// 本地开发与预览未设置该变量时回退到根路径，无需改动访问方式
const docsBase = process.env.DOCS_BASE ?? '/'

// 在线沙箱依赖与仓库实际依赖保持一致：
// @formvk/antd 取包版本，@formvk/react 取包依赖，antd/dayjs/react 取实际安装版本
const reactDependencies = {
  '@formvk/antd': `^${componentManifest.version}`,
  '@formvk/react': componentManifest.dependencies['@formvk/react'],
  antd: rootManifest.devDependencies.antd,
  dayjs: componentManifest.dependencies.dayjs,
  react: rootManifest.devDependencies.react,
  'react-dom': rootManifest.devDependencies['react-dom'],
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
  base: docsBase,
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
