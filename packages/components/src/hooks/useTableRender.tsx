import type { TableModel } from '@formvk/models'
import { isValid } from '@formvk/shared'
import { createContext, useContext, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { ColumnRenderProps, RenderProps } from '../containers/renders/types'

export interface TableRenderContextValue<Model extends TableModel = TableModel> {
  /** 表格模型，渲染器通过它访问弹窗、删除等能力 */
  table: Model
  /** 单元格空值占位符 */
  placeholder?: ReactNode
  /** 表达式作用域，会合并进渲染器参数 */
  scope?: Record<string, unknown>
}

export const TableRenderContext = createContext<TableRenderContextValue | null>(null)

export const TableRenderProvider = TableRenderContext.Provider

export function useTableRenderContext<Model extends TableModel = TableModel>() {
  const context = useContext(TableRenderContext)
  if (!context) {
    throw new Error('表格渲染器缺少上下文：请使用 CrudTable，或在自定义表格外层包裹 TableRenderProvider')
  }
  return context as TableRenderContextValue<Model>
}

export function useTableModel<Model extends TableModel = TableModel>() {
  return useTableRenderContext<Model>().table
}

/** 渲染器占位符：优先使用参数，其次上下文，最后回退到 `--` */
export function useTablePlaceholder(value?: ReactNode) {
  const { placeholder } = useTableRenderContext()
  const fallback = placeholder ?? '--'
  return isValid(value) && value !== '' ? value : fallback
}

/** 合并表达式作用域与单元格上下文，作为渲染器的完整入参 */
export function useTableRenderProps<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(props: ColumnRenderProps<Record>): RenderProps<Model, Scope, any, Record> {
  const { table, scope } = useTableRenderContext<Model>()
  const { text, record, index } = props

  return useMemo(
    () =>
      ({
        ...(scope as Scope),
        text,
        record,
        index,
        table,
        $state: table.state,
      }) as RenderProps<Model, Scope, any, Record>,
    [scope, text, record, index, table]
  )
}
