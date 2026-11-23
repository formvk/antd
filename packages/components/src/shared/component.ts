import { isStr } from '@formvk/shared'

/**
 * 判断 schema.component 是否指向某类内置组件（Column / Addition / TabPane 等）。
 *
 * formvk 的 component 有三种形态：
 * 1. 注册名字符串，如 'SelectTable.Column'；
 * 2. 组件引用（函数 / memo / forwardRef 对象），内核 getRawComponent 会直接使用；
 * 3. `{{...}}` 表达式字符串，渲染时才能确定最终组件。
 *
 * 只有字符串能直接做包含判断；组件引用退化为按 displayName / name 做身份匹配，
 * 避免 `component.includes is not a function` 崩溃。表达式字符串按不匹配处理。
 */
export const isComponentOf = (component: unknown, keyword: string): boolean => {
  if (isStr(component)) return component.includes(keyword)
  if (!component) return false
  const named = component as { displayName?: string; name?: string }
  const name = named.displayName || named.name
  return isStr(name) && name.includes(keyword)
}
