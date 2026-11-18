import type { FieldDisplayTypes, GeneralField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { Schema } from '@formvk/schema'
import { isArr, isBool, isFn } from '@formvk/shared'
import { Input, Table } from 'antd'
import type { SearchProps } from 'antd/es/input'
import type { ColumnProps, ColumnsType, TableProps } from 'antd/es/table'
import cls from 'classnames'
import { cloneElement, createElement, useMemo, useState } from 'react'
import type { FC, PropsWithChildren, ReactElement } from 'react'

import { isComponentOf, usePrefixCls } from '../__builtins__'
import { checkSlackly, flattenOptions, getIndeterminate, getSize, getTitleAddon, useFilterOptions } from './hooks'
import { useStyle } from './style'
import { getOutputData, getUISelected } from './utils'

const { Search } = Input

interface ObservableColumnSource {
  field?: GeneralField
  columnProps: ColumnProps<any>
  schema: Schema
  display?: FieldDisplayTypes
  name: string
}

type IFilterOption = boolean | ((option: any, keyword: string) => boolean)

type IFilterSort = (optionA: any, optionB: any) => number

export interface ISelectTableColumnProps extends ColumnProps<any> {
  key: string | number
}

export interface ISelectTableProps extends TableProps<any> {
  mode?: 'multiple' | 'single'
  dataSource?: any[]
  optionAsValue?: boolean
  valueType?: 'all' | 'parent' | 'child' | 'path'
  showSearch?: boolean
  searchProps?: SearchProps
  primaryKey?: string | ((record: any) => string)
  filterOption?: IFilterOption
  filterSort?: IFilterSort
  onSearch?: (keyword: string) => void
  onChange?: (value: any, options: any) => void
  value?: any
}

const isColumnComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Column')
}

const useSources = () => {
  const arrayField = useField()
  const schema = useFieldSchema()
  const parseSources = (columnSchema: Schema): ObservableColumnSource[] => {
    if (isColumnComponent(columnSchema)) {
      if (!columnSchema.componentProps?.['dataIndex'] && !columnSchema['name']) return []
      const name = columnSchema.componentProps?.['dataIndex'] || columnSchema['name']
      const field = arrayField?.query(arrayField.address.concat(name)).take()
      const columnProps = (field?.component as any[] | undefined)?.[1] || columnSchema.componentProps || {}
      const display = field?.display || columnSchema.display
      return [
        {
          name,
          display,
          field,
          schema: columnSchema,
          columnProps: {
            title: field?.title || columnProps.title,
            ...columnProps,
          },
        },
      ]
    } else if (columnSchema.properties) {
      return columnSchema.reduceProperties<ObservableColumnSource[], ObservableColumnSource[]>(
        (buf, propertySchema) => {
          return buf.concat(parseSources(propertySchema))
        },
        []
      )
    }
    return []
  }

  const parseArrayItems = (schemaItems: Schema['items']) => {
    if (!schemaItems) return []
    const sources: ObservableColumnSource[] = []
    const items = isArr(schemaItems) ? schemaItems : [schemaItems]
    return items.reduce((columns, itemSchema) => {
      const item = parseSources(itemSchema)
      if (item) {
        return columns.concat(item)
      }
      return columns
    }, sources)
  }

  if (!arrayField || !schema) return []
  const validSchema = (schema?.type === 'array' && schema?.items ? schema.items : schema) as Schema

  return parseArrayItems(validSchema)
}

const useColumns = (sources: ObservableColumnSource[]): ColumnsType<any> => {
  return sources.reduce<ColumnsType<any>>((buf, { name, columnProps, schema, display }, key) => {
    // SSR 首帧字段尚未挂载时 display 为 undefined，内核默认 display 即 visible，
    // 此处不能把 undefined 误判为隐藏，否则列会在首帧被过滤掉
    if (display && display !== 'visible') return buf
    if (!isColumnComponent(schema)) return buf
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
    })
  }, [])
}

const addPrimaryKey = (dataSource: any[], rowKey: (record: any) => string, primaryKey: string): any[] =>
  dataSource.map((item): any => {
    const children: any = isArr(item.children) ? addPrimaryKey(item.children, rowKey, primaryKey) : {}
    return {
      ...item,
      ...children,
      [primaryKey]: rowKey(item),
    }
  })

const InternalSelectTable: ReactFC<ISelectTableProps> = observer(props => {
  const {
    mode = 'multiple',
    dataSource: propsDataSource,
    optionAsValue,
    valueType = 'all',
    showSearch = false,
    filterOption,
    filterSort,
    onSearch,
    searchProps,
    className,
    value,
    onChange,
    rowSelection,
    primaryKey: rowKey = 'key',
    ...otherTableProps
  } = props
  const prefixCls = usePrefixCls('formvk-select-table', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const [searchValue, setSearchValue] = useState<string | undefined>(undefined)
  const field = useField() as any
  if (!field) return null
  const loading = isBool(props.loading) ? props.loading : field.loading
  const disabled = field.disabled
  const readOnly = field.readOnly
  const readPretty = field.readPretty
  const { searchSize, tableSize } = getSize(field.decoratorProps?.size, searchProps?.size, props?.size)
  const primaryKey = isFn(rowKey) ? '__formvk_key__' : rowKey
  const sources = useSources()
  const columns = useColumns(sources)

  // dataSource
  let dataSource = isArr(propsDataSource) ? propsDataSource : field.dataSource
  dataSource = isFn(rowKey) ? addPrimaryKey(dataSource, rowKey, primaryKey) : dataSource

  // Filter dataSource By Search
  const filteredDataSource = useFilterOptions(dataSource, searchValue, filterOption, rowSelection?.checkStrictly)

  // Order dataSource By filterSort
  const orderedFilteredDataSource = useMemo(() => {
    if (!filterSort) {
      return filteredDataSource
    }
    return [...filteredDataSource].sort((a, b) => filterSort(a, b))
  }, [filteredDataSource, filterSort])

  const flatDataSource = flattenOptions(dataSource)
  const flatFilteredDataSource = flattenOptions(filteredDataSource)

  // 分页或异步查询时，dataSource会丢失已选数据，配置optionAsValue则无法获取已选数据，需要进行合并
  const getWholeDataSource = () => {
    if (optionAsValue && mode === 'multiple' && value?.length) {
      const map = new Map()
      const arr = [...flatDataSource, ...value]
      arr.forEach(item => {
        if (!primaryKey) return
        if (!map.has(item[primaryKey])) {
          map.set(item[primaryKey], item)
        }
      })
      return [...map.values()]
    }
    return flatDataSource
  }

  // selected keys for Table UI
  const selected = getUISelected(
    value,
    flatDataSource,
    primaryKey,
    valueType,
    optionAsValue,
    mode,
    rowSelection?.checkStrictly,
    rowKey
  )

  // readPretty Value
  const readPrettyDataSource = useFilterOptions(
    orderedFilteredDataSource,
    selected,
    (val: any[], item: any) => !!(primaryKey && val.includes(item[primaryKey]))
  )

  const onInnerSearch = (searchText?: string) => {
    const formatted = (searchText || '').trim()
    setSearchValue(searchText)
    onSearch?.(formatted)
  }

  const onInnerChange = (selectedRowKeys: any[]) => {
    if (readOnly) {
      return
    }
    // 筛选后onChange默认的records数据不完整，此处需使用完整数据过滤
    const wholeRecords = getWholeDataSource().filter(item => primaryKey && selectedRowKeys.includes(item?.[primaryKey]))
    const { outputValue, outputOptions } = getOutputData(
      selectedRowKeys,
      wholeRecords,
      dataSource,
      primaryKey,
      valueType,
      optionAsValue,
      mode,
      rowSelection?.checkStrictly
    )

    onChange?.(outputValue, outputOptions)
  }

  const onRowClick = (record: Record<string, any>) => {
    if (readPretty || disabled || readOnly || record?.disabled) {
      return
    }
    const selectedRowKey = primaryKey ? record?.[primaryKey] : null
    const isSelected = selectedRowKey ? selected?.includes(selectedRowKey) : false
    let selectedRowKeys: (string | null)[] = []
    if (mode === 'single' && selectedRowKey) {
      selectedRowKeys = [selectedRowKey]
    } else {
      if (isSelected) {
        selectedRowKeys = selected.filter(item => item !== selectedRowKey)
      } else {
        selectedRowKeys = [...selected, selectedRowKey]
      }
    }
    if (rowSelection?.checkStrictly !== false) {
      onInnerChange(selectedRowKeys)
    } else {
      onSlacklyChange(selectedRowKeys)
    }
  }

  // TreeData SlacklyChange
  const onSlacklyChange = (currentSelected: any[]) => {
    const { selectedRowKeys } = checkSlackly(
      currentSelected,
      selected,
      flatDataSource,
      flatFilteredDataSource,
      primaryKey,
      rowSelection?.checkStrictly
    )
    onInnerChange(selectedRowKeys)
  }

  // Table All Checkbox
  const titleAddon = getTitleAddon(
    selected,
    flatDataSource,
    flatFilteredDataSource,
    primaryKey,
    mode,
    disabled,
    readOnly,
    rowSelection?.checkStrictly,
    onInnerChange
  )

  // Antd rowSelection type
  const modeAsType: any = { multiple: 'checkbox', single: 'radio' }?.[mode || '']

  return wrapSSR(
    <div className={cls(prefixCls, hashId)}>
      {showSearch ? (
        <Search
          {...searchProps}
          className={cls(`${prefixCls}-search`, searchProps?.className)}
          style={{ width: '100%', ...searchProps?.style }}
          onSearch={onInnerSearch}
          onChange={e => onInnerSearch(e.target.value)}
          disabled={disabled}
          readOnly={readOnly}
          size={searchSize}
          loading={loading} // antd
        />
      ) : null}
      <Table
        {...otherTableProps}
        className={cls(`${prefixCls}-table`, className)}
        dataSource={readPretty ? readPrettyDataSource : orderedFilteredDataSource}
        rowSelection={
          readPretty
            ? undefined
            : ({
                ...rowSelection,
                ...titleAddon,
                getCheckboxProps: (record: any) => ({
                  ...(rowSelection?.getCheckboxProps?.(record) as any),
                  disabled: disabled || record?.disabled,
                }), // antd
                ...(rowSelection?.checkStrictly !== false
                  ? {}
                  : {
                      renderCell: (_checked: boolean, record: any, _index: number, originNode: ReactElement<any>) => {
                        return cloneElement(originNode, {
                          indeterminate: getIndeterminate(record, flatDataSource, selected, primaryKey),
                        })
                      },
                    }),
                selectedRowKeys: selected,
                onChange: rowSelection?.checkStrictly !== false ? onInnerChange : onSlacklyChange,
                type: modeAsType,
                preserveSelectedRowKeys: true,
                checkStrictly: true,
              } as any)
        }
        columns={props.columns || columns}
        rowKey={primaryKey}
        loading={loading}
        size={tableSize}
        onRow={record => {
          // antd
          const onRowResult = otherTableProps.onRow?.(record)
          return {
            ...onRowResult,
            onClick: e => {
              onRowResult?.onClick?.(e)
              onRowClick(record)
            },
          }
        }}
      />
      {sources.map((column, key) => {
        //专门用来承接对Column的状态管理
        if (!isColumnComponent(column.schema)) return
        return createElement(RecursionField, {
          name: column.name,
          schema: column.schema,
          onlyRenderSelf: true,
          key,
        })
      })}
    </div>
  )
})

export const SelectTableColumn: FC<PropsWithChildren<ISelectTableColumnProps>> = () => <></>

export const SelectTable = InternalSelectTable
