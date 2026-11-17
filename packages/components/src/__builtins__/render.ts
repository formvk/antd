import type { ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'

// 移植自 rc-util 的 render 封装；React 19 已移除 legacy render，仅保留 createRoot 路径。
// 参见 ../../vendor/formily-antd/packages/components/src/__builtins__/render.ts

const MARK = '__formvk_root__'

type ContainerType = (Element | DocumentFragment) & {
  [MARK]?: Root
}

export function render(node: ReactElement, container: ContainerType) {
  const root = container[MARK] || createRoot(container)
  root.render(node)
  container[MARK] = root
}

export function unmount(container: ContainerType) {
  // Delay to unmount to avoid React sync warning
  return Promise.resolve().then(() => {
    container[MARK]?.unmount()
    delete container[MARK]
  })
}
