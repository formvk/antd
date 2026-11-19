import type { TableModel } from '@formvk/models'
import type { ReactNode } from 'react'

/** antd 表格列 render 的签名 */
export type ColumnRender<IRecord extends object = any, Value = any> = (
  text: Value,
  record: IRecord,
  index: number
) => ReactNode

export interface ColumnRenderProps<IRecord extends object = any, Value = any> {
  text: Value
  record: IRecord
  index: number
}

/** 渲染器入参：单元格上下文 + 表格模型 + 自定义作用域 */
export type RenderProps<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Value = any,
  Record extends object = Model['records'][number],
> = ColumnRenderProps<Record, Value> & {
  table: Model
  $state: Model['state']
} & Scope

/** 选项树，`Extra` 用于附加渲染器需要的属性（如 Tag 的 `color`） */
export type ITree<Extra extends object = object> = {
  label?: ReactNode
  value?: any
  children?: ITree<Extra>[]
} & Extra
