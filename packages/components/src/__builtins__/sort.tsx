import { DndContext } from '@dnd-kit/core'
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import type { ReactFC } from '@formvk/reactive-react'
import { createContext, useContext, useMemo } from 'react'
import type { CSSProperties, HTMLAttributes, ReactElement } from 'react'

export interface ISortableContainerProps {
  list: any[]
  start?: number
  accessibility?: {
    container?: Element
  }
  onSortStart?: (event: DragStartEvent) => void
  onSortEnd?: (event: { oldIndex: number; newIndex: number }) => void
}

export function SortableContainer<T extends HTMLAttributes<HTMLElement>>(
  Component: ReactFC<T>
): ReactFC<ISortableContainerProps & T> {
  return ({ list, start = 0, accessibility, onSortStart, onSortEnd, ...props }) => {
    const handleSortEnd = (event: DragEndEvent) => {
      const { active, over } = event
      if (!over) return
      const oldIndex = +active.id - 1
      const newIndex = +over.id - 1
      onSortEnd?.({
        oldIndex,
        newIndex,
      })
    }

    return (
      <DndContext accessibility={accessibility} onDragStart={onSortStart} onDragEnd={handleSortEnd}>
        <SortableContext items={list.map((_, index) => index + start + 1)} strategy={verticalListSortingStrategy}>
          <Component {...(props as unknown as T)}>{props.children}</Component>
        </SortableContext>
      </DndContext>
    )
  }
}

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

export interface ISortableElementProps {
  index?: number
  lockAxis?: 'x' | 'y'
}

export function SortableElement<T extends HTMLAttributes<HTMLElement>>(
  Component: ReactFC<T>
): ReactFC<T & ISortableElementProps> {
  return ({ index = 0, lockAxis, ...props }) => {
    const sortable = useSortable({
      id: index + 1,
    })
    const { setNodeRef, transform, transition, isDragging } = sortable
    if (transform) {
      switch (lockAxis) {
        case 'x':
          transform.y = 0
          break
        case 'y':
          transform.x = 0
          break

        default:
          break
      }
    }

    const style = useMemo(() => {
      const zIndex = transform ? 1 : 'none'
      const position = transform ? 'relative' : 'unset'
      const itemStyle: CSSProperties = {
        position,
        touchAction: 'none',
        zIndex,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : 'none',
        transition: `${transform ? 'all 200ms ease' : ''}`,
      }
      const dragStyle = {
        transition,
        opacity: '0.8',
        transform: `translate3d(${transform?.x || 0}px, ${transform?.y || 0}px, 0)`,
      }

      const computedStyle = isDragging
        ? {
            ...itemStyle,
            ...dragStyle,
            ...props.style,
          }
        : {
            ...itemStyle,
            ...props.style,
          }

      return computedStyle
    }, [isDragging, transform, transition, props.style])

    return (
      <SortableItemContext.Provider value={sortable}>
        {
          Component({
            ...props,
            style,
            ref: setNodeRef,
          } as unknown as T) as ReactElement
        }
      </SortableItemContext.Provider>
    )
  }
}

export function SortableHandle<T extends HTMLAttributes<HTMLElement>>(Component: ReactFC<T>): ReactFC<T> {
  return (props: T) => {
    const { attributes, listeners } = useSortableItem()
    return <Component {...props} {...attributes} {...listeners} />
  }
}
