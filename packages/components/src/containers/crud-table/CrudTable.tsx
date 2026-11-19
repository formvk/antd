import type { TableModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import type { ISchema } from '@formvk/schema'
import { Table } from 'antd'
import type { TableProps } from 'antd'
import { useEffect, useMemo } from 'react'
import type { ComponentType, ReactNode } from 'react'

import { TableRenderProvider } from '../../hooks'
import { SchemaForm } from '../form'
import { PopupForm } from '../popup'
import type { DrawerFormProps, ModalFormProps } from '../popup'

/** 新增 / 编辑弹窗配置，`type` 默认 `drawer` */
export type CrudTablePopupProps =
  | (Omit<DrawerFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type?: 'drawer' })
  | (Omit<ModalFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type: 'modal' })

export interface CrudTableProps<IRecord extends object = any> extends Omit<
  TableProps<IRecord>,
  'dataSource' | 'pagination' | 'loading' | 'title'
> {
  /** 表格模型，负责搜索、分页、记录与增删改的数据流转 */
  table: TableModel<IRecord>
  /** 搜索表单 schema */
  search?: ISchema
  /** 新增表单 schema */
  add?: ISchema
  /** 编辑表单 schema */
  edit?: ISchema
  /** 标题，用于拼接弹窗标题 */
  title?: ReactNode
  /** 表达式作用域，同时合并进表格渲染器参数 */
  scope?: Record<string, unknown>
  /** 追加或覆盖内置组件 */
  components?: Record<string, ComponentType<any>>
  /** 单元格空值占位符，供 `renders` 使用，默认 `--` */
  placeholder?: ReactNode
  /** 新增与编辑弹窗的公共配置，可被 `addProps` / `editProps` 覆盖 */
  popupProps?: CrudTablePopupProps
  /** 新增弹窗配置，覆盖 `popupProps` */
  addProps?: CrudTablePopupProps
  /** 编辑弹窗配置，覆盖 `popupProps` */
  editProps?: CrudTablePopupProps
}

export const CrudTable = observer((props: CrudTableProps) => {
  const { table, search, add, edit, title, scope, components, placeholder, popupProps, addProps, editProps, ...rest } =
    props

  useEffect(() => {
    table.onMount()
  }, [table])

  const renderContext = useMemo(() => ({ table, placeholder, scope }), [table, placeholder, scope])

  const addPopupConfig = {
    type: 'drawer',
    title: `新增${title ?? ''}`,
    ...popupProps,
    ...addProps,
  } as Omit<DrawerFormProps, 'popup'>

  const editPopupConfig = {
    type: 'drawer',
    title: `编辑${title ?? ''}`,
    ...popupProps,
    ...editProps,
  } as Omit<DrawerFormProps, 'popup'>

  return (
    <TableRenderProvider value={renderContext}>
      {search ? (
        <SchemaForm
          form={table.form}
          schema={search}
          scope={scope}
          components={components}
          onAutoSubmit={() => table.search()}
        />
      ) : null}
      <Table
        {...rest}
        dataSource={table.records}
        loading={table.form.submitting}
        pagination={{
          current: table.pagination.current,
          pageSize: table.pagination.pageSize,
          total: table.pagination.total,
          onChange: (current, pageSize) =>
            table.onSearch({
              current,
              pageSize,
              total: table.pagination.total,
            }),
        }}
      />
      {add ? (
        <PopupForm {...addPopupConfig} popup={table.addPopup} schema={add} scope={scope} components={components} />
      ) : null}
      {edit ? (
        <PopupForm {...editPopupConfig} popup={table.editPopup} schema={edit} scope={scope} components={components} />
      ) : null}
    </TableRenderProvider>
  )
})
