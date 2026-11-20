import type { TableModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import type { ISchema } from '@formvk/schema'
import type { ComponentType } from 'react'

import { TableModelProvider } from '../../hooks'
import type { DrawerFormProps, ModalFormProps } from '../popup'
import type { DataTableProps, SearchFormProps } from './widgets'
import { AddPopup, DataTable, EditPopup, SearchForm } from './widgets'

/** 新增 / 编辑弹窗配置，`type` 默认 `drawer` */
export type CrudTablePopupProps =
  | (Omit<DrawerFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type?: 'drawer' })
  | (Omit<ModalFormProps, 'popup' | 'schema' | 'scope' | 'components'> & { type: 'modal' })

export interface CrudTableProps<IRecord extends object = any> extends DataTableProps<IRecord> {
  /** 表格模型，负责搜索、分页、记录与增删改的数据流转 */
  table: TableModel<IRecord>
  /** 搜索表单 schema */
  search?: ISchema
  /** 新增表单 schema */
  add?: ISchema
  /** 编辑表单 schema */
  edit?: ISchema
  /** 表达式作用域，同时合并进表格渲染器参数 */
  scope?: Record<string, unknown>
  /** 追加或覆盖内置组件 */
  components?: Record<string, ComponentType<any>>
  /** 搜索表单配置，覆盖内部默认值 */
  searchProps?: Omit<SearchFormProps, 'form' | 'schema' | 'scope' | 'components'>
  /** 新增与编辑弹窗的公共配置，可被 `addProps` / `editProps` 覆盖 */
  popupProps?: CrudTablePopupProps
  /** 新增弹窗配置，覆盖 `popupProps` */
  addProps?: CrudTablePopupProps
  /** 编辑弹窗配置，覆盖 `popupProps` */
  editProps?: CrudTablePopupProps
}

/**
 * 标准「搜索 + 表格 + 新增 / 编辑」组合。
 * 需要自定义布局时，可改用 `TableModelProvider` 与 `SearchForm` / `DataTable` / `AddPopup` / `EditPopup` 自由组装
 */
function CrudTableWidget<IRecord extends object = any>(props: CrudTableProps<IRecord>) {
  const {
    table,
    search,
    add,
    edit,
    scope,
    components,
    placeholder,
    searchProps,
    popupProps,
    addProps,
    editProps,
    ...rest
  } = props

  const addPopupConfig = { type: 'drawer', ...popupProps, ...addProps } as CrudTablePopupProps
  const editPopupConfig = { type: 'drawer', ...popupProps, ...editProps } as CrudTablePopupProps

  return (
    <TableModelProvider value={table} placeholder={placeholder} scope={scope}>
      {search ? <SearchForm {...searchProps} schema={search} scope={scope} components={components} /> : null}
      <DataTable<IRecord> {...rest} />
      {add ? <AddPopup {...addPopupConfig} schema={add} scope={scope} components={components} /> : null}
      {edit ? <EditPopup {...editPopupConfig} schema={edit} scope={scope} components={components} /> : null}
    </TableModelProvider>
  )
}

export const CrudTable = observer(CrudTableWidget) as typeof CrudTableWidget
