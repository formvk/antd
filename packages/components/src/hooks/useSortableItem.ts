import { createContext, useContext } from 'react'

/**
 * 显式声明 context 类型，避免 dnd-kit 内部 Transform 等传递依赖类型
 * 泄漏到声明产物（TS2883 可移植性约束）。
 */
export interface ISortableItemContext {
  attributes?: Record<string, any>
  listeners?: Record<string, any>
  setNodeRef?: (element: HTMLElement | null) => void
  transform?: any
  transition?: string
  isDragging?: boolean
}

export const SortableItemContext = createContext<Partial<ISortableItemContext>>({})

export const useSortableItem = (): Partial<ISortableItemContext> => {
  return useContext(SortableItemContext)
}
