import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { defineConfig } from 'vitepress'
import { vitepressDemoPlugin } from 'vitepress-demo-plugin/markdown'
import llmstxt from 'vitepress-plugin-llms'

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

// catalog: 协议不能直接用于沙箱模板，从 workspace 的 catalog 中读取真实版本范围
const workspaceYaml = readFileSync(path.join(rootDir, 'pnpm-workspace.yaml'), 'utf8')
const catalogVersion = (name: string) => workspaceYaml.match(new RegExp(`'${name}':\\s*(\\S+)`))?.[1] ?? 'latest'

// 在线沙箱依赖与仓库实际依赖保持一致：
// @formvk/antd 取包版本，@formvk/react / @formvk/models 取 catalog，antd/dayjs/react 取实际安装版本
const reactDependencies = {
  '@formvk/antd': `^${componentManifest.version}`,
  '@formvk/models': catalogVersion('@formvk/models'),
  '@formvk/react': catalogVersion('@formvk/react'),
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
  'DemoTheme.tsx': readFileSync(path.join(rootDir, 'docs/demos/DemoTheme.tsx'), 'utf8'),
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
    plugins: [llmstxt()],
    resolve: {
      alias: {
        '@formvk/antd': path.resolve(rootDir, 'packages/components/src/index.ts'),
      },
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        // antd / @ant-design/icons 等依赖顶部的 "use client" 指令只对 RSC 构建有意义，
        // 普通 SPA 打包会逐条告警，这里过滤掉这类兼容性噪音
        onwarn(warning, warn) {
          if (warning.code === 'MODULE_LEVEL_DIRECTIVE' && /"(use client|use server)"/.test(warning.message)) {
            return
          }
          warn(warning)
        },
      },
    },
  },
  themeConfig: {
    nav: [
      { text: '指南', link: '/guide/install' },
      { text: '组件', link: '/components/' },
      { text: '容器', link: '/containers/' },
      { text: '内核', link: 'https://formvk.github.io/core/' },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '教程',
          collapsed: false,
          items: [
            { text: '安装', link: '/guide/install' },
            { text: '快速开始', link: '/guide/quick-start' },
          ],
        },
        {
          text: '操作指南',
          collapsed: false,
          items: [
            { text: '字段联动', link: '/guide/how-to/linkage' },
            { text: '表单校验', link: '/guide/how-to/validation' },
            { text: '数组字段操作', link: '/guide/how-to/array' },
            { text: '大数组场景', link: '/guide/how-to/large-array' },
            { text: '响应式布局', link: '/guide/how-to/layout' },
            { text: '阅读态与详情页', link: '/guide/how-to/read-pretty' },
            { text: '接入自定义组件', link: '/guide/how-to/custom-component' },
          ],
        },
        {
          text: '参考',
          collapsed: false,
          items: [
            { text: 'Schema 参考', link: '/guide/schema' },
            { text: '组件参考', link: '/components/' },
          ],
        },
        {
          text: '理解',
          collapsed: false,
          items: [
            { text: 'Schema 驱动与表单状态模型', link: '/guide/explanation/schema-driven' },
            { text: '阅读态 Text 渲染机制', link: '/guide/explanation/read-pretty-rendering' },
            { text: '与 formily-antd 的差异', link: '/guide/explanation/formily-diff' },
          ],
        },
      ],
      '/components/': [
        {
          text: '组件',
          items: [
            { text: '总览', link: '/components/' },
            {
              text: '表单与布局',
              collapsed: false,
              items: [
                { text: 'Form', link: '/components/form' },
                { text: 'FormItem', link: '/components/form-item' },
                { text: 'FormLayout', link: '/components/form-layout' },
                { text: 'FormGrid', link: '/components/form-grid' },
                { text: 'FormButtonGroup', link: '/components/form-button-group' },
                { text: 'Submit', link: '/components/submit' },
                { text: 'Reset', link: '/components/reset' },
                { text: 'Space', link: '/components/space' },
              ],
            },
            {
              text: '基础字段',
              collapsed: false,
              items: [
                { text: 'Input', link: '/components/input' },
                { text: 'Password', link: '/components/password' },
                { text: 'InputNumber', link: '/components/input-number' },
                { text: 'Select', link: '/components/select' },
                { text: 'Radio', link: '/components/radio' },
                { text: 'Checkbox', link: '/components/checkbox' },
                { text: 'Switch', link: '/components/switch' },
                { text: 'DatePicker', link: '/components/date-picker' },
                { text: 'TimePicker', link: '/components/time-picker' },
                { text: 'Cascader', link: '/components/cascader' },
                { text: 'TreeSelect', link: '/components/tree-select' },
                { text: 'Transfer', link: '/components/transfer' },
                { text: 'Upload', link: '/components/upload' },
                { text: 'Text', link: '/components/preview-text' },
              ],
            },
            {
              text: '数组组件',
              collapsed: false,
              items: [
                { text: 'ArrayBase', link: '/components/array-base' },
                { text: 'ArrayItems', link: '/components/array-items' },
                { text: 'ArrayCards', link: '/components/array-cards' },
                { text: 'ArrayCollapse', link: '/components/array-collapse' },
                { text: 'ArrayTabs', link: '/components/array-tabs' },
                { text: 'ArrayTable', link: '/components/array-table' },
                { text: 'SelectTable', link: '/components/select-table' },
              ],
            },
            {
              text: '高级组件',
              collapsed: false,
              items: [
                { text: 'Editable', link: '/components/editable' },
                { text: 'FormTab', link: '/components/form-tab' },
                { text: 'FormCollapse', link: '/components/form-collapse' },
                { text: 'FormStep', link: '/components/form-step' },
              ],
            },
          ],
        },
      ],
      '/containers/': [
        {
          text: '容器',
          items: [
            { text: '总览', link: '/containers/' },
            { text: 'SchemaForm', link: '/containers/schema-form' },
            { text: '弹窗表单', link: '/containers/popup' },
            { text: 'CrudTable', link: '/containers/crud-table' },
            { text: '表格渲染器', link: '/containers/renders' },
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
    lastUpdated: {
      text: '最后更新',
    },
    darkModeSwitchLabel: '主题',
    sidebarMenuLabel: '目录',
    returnToTopLabel: '回到顶部',
  },
})
