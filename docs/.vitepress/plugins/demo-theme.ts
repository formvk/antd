import path from 'node:path'

import type { Plugin } from 'vite'

const demoNamesDir = path.resolve(import.meta.dirname, '../../demos')
const themeEntry = path.resolve(import.meta.dirname, '../theme/DemoTheme')

/**
 * 在构建期给 docs/demos 下的示例包一层主题容器，
 * 示例源码本身保持干净，复制到沙箱时不会混入文档基础设施。
 */
export const demoThemePlugin = (): Plugin => ({
  name: 'formvk:demo-theme',
  enforce: 'pre',
  transform(code, id) {
    const file = id.split('?')[0]
    if (!file.endsWith('.tsx') || !file.startsWith(demoNamesDir + path.sep)) return
    if (!code.includes('export default')) return

    const relativeEntry = path.relative(path.dirname(file), themeEntry).replaceAll(path.sep, '/')

    return {
      code: [
        `import { withDemoTheme } from '${relativeEntry}'`,
        code.replace('export default', 'const __Demo = '),
        'export default withDemoTheme(__Demo)',
      ].join('\n'),
      map: null,
    }
  },
})
