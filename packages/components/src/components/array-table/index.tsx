import type { ArrayField, FieldDisplayTypes, GeneralField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { Schema } from '@formvk/schema'
import { isArr, isBool, isFn } from '@formvk/shared'
import { Badge, Pagination, Select, Space, Table } from 'antd'
import type { SizeType } from 'antd/es/config-provider/SizeContext'
import type { PaginationProps } from 'antd/es/pagination'
import type { SelectProps } from 'antd/es/select'
import type { ColumnProps, ColumnsType } from 'antd/es/table'
import type { TableProps } from 'antd/es/table'
import cls from 'classnames'
import {
  createContext,
  createElement,
  forwardRef,
  Fragment,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { HTMLAttributes, ReactElement, ReactNode, Ref } from 'react'

import { isComponentOf, SortableContainer, SortableElement, usePrefixCls } from '../../shared'
import type { ISortableContainerProps } from '../../shared'
import { Addition, ArrayBase, ArrayBaseItem, useArray } from '../array-base'
import type { IAdditionProps } from '../array-base'
import { useStyle } from './style'

interface ObservableColumnSource {
  field?: GeneralField
  columnProps: ColumnProps<any>
  schema: Schema
  display?: FieldDisplayTypes
  name: string
}
interface IArrayTablePaginationProps extends PaginationProps {
  dataSource?: any[]
  showPagination: boolean
  children?: (
    dataSource: any[],
    pagination: ReactNode,
    options: {
      startIndex: number
    }
  ) => ReactElement
}

interface IStatusSelectProps extends SelectProps<any> {
  pageSize?: number
}

interface PaginationAction {
  totalPage?: number
  pageSize?: number
  startIndex?: number
  changePage?: (page: number) => void
}

const SortableRow = SortableElement(props => <tr {...props} />)

const SortableBodyRaw = SortableContainer<
  HTMLAttributes<HTMLTableSectionElement> & {
    tbodyRef: Ref<HTMLTableSectionElement>
  }
>(({ tbodyRef, ...props }) => <tbody {...props} ref={tbodyRef} />)
const SortableBody = forwardRef<
  HTMLTableSectionElement,
  HTMLAttributes<HTMLTableSectionElement> & ISortableContainerProps
>((props, ref) => <SortableBodyRaw {...props} tbodyRef={ref} />)

const isColumnComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Column')
}

const isOperationsComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Operations')
}

const isAdditionComponent = (schema: Schema) => {
  return isComponentOf(schema.component, 'Addition')
}

const useArrayTableSources = () => {
  const arrayField = useField()
  const schema = useFieldSchema()
  const parseSources = (columnSchema: Schema): ObservableColumnSource[] => {
    if (isColumnComponent(columnSchema) || isOperationsComponent(columnSchema) || isAdditionComponent(columnSchema)) {
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
          columnProps,
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

  if (!schema) throw new Error('can not found schema object')

  return parseArrayItems(schema.items)
}
const indexKey = '__DO_NOT_USE_THIS_PROPERTY_index__'
const useArrayTableColumns = (
  _dataSource: any[],
  field: ArrayField,
  sources: ObservableColumnSource[]
): ColumnsType<any> => {
  return sources.reduce<ColumnsType<any>>((buf, { name, columnProps, schema, display }, key) => {
    // SSR 首帧字段尚未挂载时 display 为 undefined，内核默认 display 即 visible，
    // 此处不能把 undefined 误判为隐藏，否则列会在首帧被过滤掉
    if (display && display !== 'visible') return buf
    if (!isColumnComponent(schema)) return buf
    return buf.concat({
      ...columnProps,
      key,
      dataIndex: name,
      render: (_value: any, record: any) => {
        const index = record[indexKey]

        const children = (
          <ArrayBaseItem index={index} record={() => field?.value?.[index]}>
            <RecursionField schema={schema} name={index} onlyRenderProperties />
          </ArrayBaseItem>
        )

        return index > -1 ? children : null
      },
    })
  }, [])
}

const useAddition = () => {
  const schema = useFieldSchema()
  return schema?.reduceProperties((addition, propertySchema, key) => {
    if (isAdditionComponent(propertySchema)) {
      return <RecursionField schema={propertySchema} name={key} />
    }
    return addition
  }, null)
}

const schedulerRequest = {
  request: null as null | number,
}

const StatusSelect: ReactFC<IStatusSelectProps> = observer(
  props => {
    const field = useField<ArrayField>()
    const prefixCls = usePrefixCls('formvk-array-table')
    const [wrapSSR, hashId] = useStyle(prefixCls)
    if (!field) return null
    const errors = field.errors
    const parseIndex = (address?: string) => {
      return Number(address?.slice(address.indexOf(field.address.toString())).match(/(\d+)/)?.[1])
    }
    const options = props.options?.map(({ label, value }) => {
      const val = Number(value)
      const hasError = errors.some(({ address }) => {
        const currentIndex = parseIndex(address)
        const startIndex = props.pageSize ? (val - 1) * props.pageSize : 0
        const endIndex = props.pageSize ? val * props.pageSize : props.options?.length || 0
        return currentIndex >= startIndex && currentIndex <= endIndex
      })
      return {
        label: hasError ? <Badge dot>{label}</Badge> : label,
        value,
      }
    })

    const width = String(options?.length).length * 15

    return wrapSSR(
      <Select
        value={props.value}
        onChange={props.onChange}
        options={options}
        virtual
        style={{
          width: width < 60 ? 60 : width,
        }}
        className={cls(`${prefixCls}-status-select`, hashId, {
          'has-error': errors?.length,
        })}
      />
    )
  },
  {
    scheduler: update => {
      clearTimeout(schedulerRequest.request as any)
      schedulerRequest.request = setTimeout(() => {
        update()
      }, 100) as unknown as number
    },
  }
)

const PaginationContext = createContext<PaginationAction>({})
const usePagination = () => {
  return useContext(PaginationContext)
}

const ArrayTablePagination: ReactFC<IArrayTablePaginationProps> = props => {
  const [current, setCurrent] = useState(1)
  const prefixCls = usePrefixCls('formvk-array-table')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const [pageSize, setPageSize] = useState(props.pageSize || 10)
  // antd v6 SizeType 移除了 'default'，缺省归一到 'middle'
  const size: SizeType = props.size ?? 'middle'
  const dataSource = props.dataSource || []
  const showPagination = props.showPagination
  const startIndex = (current - 1) * pageSize
  const endIndex = startIndex + pageSize - 1
  const total = dataSource?.length || 0
  const totalPage = Math.ceil(total / pageSize)
  const pages = Array.from(new Array(totalPage)).map((_, index) => {
    const page = index + 1
    return {
      label: page,
      value: page,
    }
  })
  const handleChange = useCallback((nextPage: number) => {
    setCurrent(nextPage)
  }, [])
  const handleSizeChange = useCallback((_: number, nextPageSize: number) => {
    setPageSize(nextPageSize)
  }, [])

  // 渲染期对齐 props.pageSize 变化（React 官方推荐的 state 派生模式，避免 effect 级联渲染）
  const [prevPageSizeProp, setPrevPageSizeProp] = useState(props.pageSize)
  if (props.pageSize !== prevPageSizeProp) {
    setPrevPageSizeProp(props.pageSize)
    setPageSize(props.pageSize || 10)
  }

  // 数据缩减后当前页越界时回退到末页
  if (totalPage > 0 && totalPage < current) {
    setCurrent(totalPage)
  }

  const renderPagination = () => {
    if (!showPagination || totalPage < 1) return
    return (
      <div className={cls(`${prefixCls}-pagination`, hashId)}>
        <Space>
          <StatusSelect
            value={current}
            pageSize={pageSize}
            onChange={handleChange}
            options={pages}
            notFoundContent={false}
          />
          <Pagination
            {...props}
            pageSize={pageSize}
            current={current}
            total={dataSource.length}
            size={size}
            showSizeChanger={true}
            onShowSizeChange={handleSizeChange}
            onChange={handleChange}
          />
        </Space>
      </div>
    )
  }

  const paginationContext = useMemo(
    () => ({ totalPage, pageSize, startIndex, changePage: handleChange }),
    [totalPage, pageSize, startIndex, handleChange]
  )

  return wrapSSR(
    <Fragment>
      <PaginationContext.Provider value={paginationContext}>
        {props.children?.(
          showPagination ? dataSource?.slice(startIndex, endIndex + 1) : dataSource,
          renderPagination(),
          {
            startIndex,
          }
        )}
      </PaginationContext.Provider>
    </Fragment>
  )
}

const WrapperComp = (props: HTMLAttributes<HTMLTableSectionElement>) => {
  // callback ref 落地为 state，避免渲染期读取 ref.current，同时让 accessibility.container 拿到真实节点
  const [tbodyEl, setTbodyEl] = useState<HTMLTableSectionElement | null>(null)
  const field = useField<ArrayField>()
  const prefixCls = usePrefixCls('formvk-array-table')
  const { startIndex } = useContext(PaginationContext)
  if (!field) return null
  const dataSource = Array.isArray(field.value) ? field.value.slice() : []

  const addTdStyles = (id: number) => {
    const node = tbodyEl?.querySelector(`.${prefixCls}-row-${id}`)
    const helper = document.body.querySelector(`.${prefixCls}-sort-helper`)
    if (!helper) return
    const tds = node?.querySelectorAll('td')
    if (!tds) return
    requestAnimationFrame(() => {
      helper.querySelectorAll('td').forEach((td, index) => {
        if (tds[index]) {
          td.style.width = getComputedStyle(tds[index]).width
        }
      })
    })
  }

  return (
    <SortableBody
      ref={setTbodyEl}
      {...props}
      start={startIndex}
      list={dataSource.slice()}
      accessibility={{
        container: tbodyEl || undefined,
      }}
      onSortStart={event => {
        addTdStyles(event.active.id as number)
      }}
      onSortEnd={({ oldIndex, newIndex }) => {
        field.move(oldIndex, newIndex)
      }}
      className={cls(`${prefixCls}-sort-helper`, props.className)}
    />
  )
}

const RowComp: ReactFC<HTMLAttributes<HTMLTableRowElement>> = props => {
  const prefixCls = usePrefixCls('formvk-array-table')
  const index = (props as any)['data-row-key'] || 0
  return (
    <SortableRow
      lockAxis="y"
      {...props}
      index={index}
      className={cls(props.className, `${prefixCls}-row-${index + 1}`)}
    />
  )
}

const InternalArrayTable: ReactFC<TableProps<any>> = observer((props: TableProps<any>) => {
  const ref = useRef<HTMLDivElement>(null)
  const field = useField<ArrayField>()
  const prefixCls = usePrefixCls('formvk-array-table')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  if (!field) return null
  const dataSource = Array.isArray(field.value) ? field.value.slice() : []
  dataSource.forEach((item, index) => {
    item[indexKey] = index
  })
  const sources = useArrayTableSources()
  const columns = useArrayTableColumns(dataSource, field, sources)
  const pagination = isBool(props.pagination) ? {} : props.pagination
  const showPagination = isBool(props.pagination) ? props.pagination : true
  const addition = useAddition()
  const defaultRowKey = (record: any) => {
    return record[indexKey]
  }

  return wrapSSR(
    <ArrayTablePagination {...pagination} dataSource={dataSource} showPagination={showPagination}>
      {(pageDataSource, pager) => {
        return (
          <div ref={ref} className={cls(prefixCls, hashId)}>
            <ArrayBase>
              <Table
                size="small"
                bordered
                rowKey={defaultRowKey}
                {...props}
                onChange={() => {}}
                pagination={false}
                columns={columns}
                dataSource={pageDataSource}
                components={{
                  body: {
                    wrapper: WrapperComp as any,
                    row: RowComp as any,
                  },
                }}
              />
              <div style={{ marginTop: 5, marginBottom: 5 }}>{pager}</div>
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
              {addition}
            </ArrayBase>
          </div>
        )
      }}
    </ArrayTablePagination>
  )
})

export const ArrayTableAddition: ReactFC<IAdditionProps> = props => {
  const array = useArray()
  const { totalPage = 0, pageSize = 10, changePage } = usePagination()
  return (
    <Addition
      {...props}
      onClick={e => {
        // 如果添加数据后将超过当前页，则自动切换到下一页
        const total = array?.field?.value?.length || 0
        if (total === totalPage * pageSize + 1 && isFn(changePage)) {
          changePage(totalPage + 1)
        }
        props.onClick?.(e)
      }}
    />
  )
}

export const ArrayTable = InternalArrayTable
