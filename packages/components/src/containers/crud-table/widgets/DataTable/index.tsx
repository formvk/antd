import type { TableModel } from '@formvk/models'
import { ExpressionScope } from '@formvk/react'
import { computed } from '@formvk/reactive'
import { observer } from '@formvk/reactive-react'
import type { Stringify } from '@formvk/schema'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { useCallback, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'

import type { TableRenderContextValue } from '../../../../hooks'
import { TableRenderContext, useTableModel, useTableRenderContext, useTableScope } from '../../../../hooks'

type Columns<IRecord extends object> = NonNullable<TableProps<IRecord>['columns']>

export interface DataTableProps<IRecord extends object = any> extends Omit<
  TableProps<IRecord>,
  'columns' | 'dataSource' | 'loading' | 'pagination'
> {
  /** 列配置，支持 `{{ }}` 表达式 */
  columns?: Stringify<Columns<IRecord>[number]>[]
  /** 分页配置，默认使用模型分页；传 `false` 关闭分页 */
  pagination?: TableProps<IRecord>['pagination']
  /** 表达式作用域，会与上下文 scope、`$table`、`$state` 合并 */
  scope?: Record<string, unknown>
  /** 单元格空值占位符，供渲染器使用，默认继承上下文 */
  placeholder?: ReactNode
}

/** 表格模型驱动的表格，分页、加载态与列表达式由模型接管 */
function DataTableWidget<IRecord extends object = any>(props: DataTableProps<IRecord>) {
  const { columns, onChange, pagination, scope, placeholder, ...rest } = props
  const table = useTableModel<TableModel<IRecord>>()
  const context = useTableRenderContext<TableModel<IRecord>>()
  const expressionScope = useTableScope(scope)

  useEffect(() => {
    table.onMount()
  }, [table])

  const handleChange = useCallback<NonNullable<TableProps<IRecord>['onChange']>>(
    (nextPagination, sorter, filters, extra) => {
      onChange?.(nextPagination, sorter, filters, extra)
      table.onSearch({
        current: nextPagination.current ?? table.pagination.current,
        pageSize: nextPagination.pageSize ?? table.pagination.pageSize,
        total: nextPagination.total ?? table.pagination.total,
      })
    },
    [table, onChange]
  )

  const mergedPagination =
    pagination === false ? false : { ...(typeof pagination === 'object' ? pagination : null), ...table.pagination }

  const compiledColumns = useMemo(
    () => computed(() => table.compile<Columns<IRecord>[number]>(columns ?? [], expressionScope)),
    [table, columns, expressionScope]
  )

  const contextValue = useMemo<TableRenderContextValue<TableModel<IRecord>>>(
    () => ({ ...context, placeholder: placeholder ?? context.placeholder, scope: expressionScope }),
    [context, placeholder, expressionScope]
  )

  return (
    <TableRenderContext.Provider value={contextValue}>
      <ExpressionScope value={expressionScope}>
        <Table
          {...rest}
          loading={table.form.submitting}
          onChange={handleChange}
          pagination={mergedPagination}
          columns={compiledColumns.value}
          dataSource={table.records}
        />
      </ExpressionScope>
    </TableRenderContext.Provider>
  )
}

export const DataTable = observer(DataTableWidget) as typeof DataTableWidget
