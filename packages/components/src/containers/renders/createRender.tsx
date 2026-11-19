import type { TableModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import type { FC } from 'react'

import { useTableRenderProps } from '../../hooks'
import type { ColumnRender, ColumnRenderProps, RenderProps } from './types'

/**
 * 将 React 组件转换为 antd 表格列渲染函数。
 * 组件会以 `observer` 包裹，并从 TableRenderProvider 注入 `table` / `$state` / `scope`。
 */
export function createRender<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Value = any,
  Record extends object = Model['records'][number],
>(Component: FC<RenderProps<Model, Scope, Value, Record>>): ColumnRender<Record, Value> {
  const ObserverComponent = observer(Component as FC<any>)

  const Render = observer((props: ColumnRenderProps) => {
    const renderProps = useTableRenderProps<Model, Scope, Record>(props)
    return <ObserverComponent {...renderProps} />
  })

  return (text, record, index) => <Render text={text} record={record} index={index} />
}
