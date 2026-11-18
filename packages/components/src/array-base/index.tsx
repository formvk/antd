import { CopyOutlined, DeleteOutlined, DownOutlined, MenuOutlined, PlusOutlined, UpOutlined } from '@ant-design/icons'
import type { ArrayField } from '@formvk/core'
import { useField, useFieldSchema } from '@formvk/react'
import type { Schema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import { clone, isUndef, isValid } from '@formvk/shared'
import { Button } from 'antd'
import type { ButtonProps } from 'antd/es/button'
import cls from 'classnames'
import { createContext, useContext, useMemo } from 'react'
import type { FC, HTMLAttributes, Ref } from 'react'

import { SortableHandle, usePrefixCls } from '../__builtins__'
import { useStyle } from './style'

export interface IAdditionProps extends ButtonProps {
  title?: string
  method?: 'push' | 'unshift'
  defaultValue?: any
}

export interface IArrayBaseContext {
  props: IArrayBaseProps
  field: ArrayField
  schema: Schema
}

export interface IArrayBaseItemProps {
  index: number
  record: ((index: number) => Record<string, any>) | Record<string, any>
}

type CommonProps = ButtonProps & {
  index?: number
}

export interface IArrayBaseProps {
  disabled?: boolean
  onAdd?: (index: number) => void
  onCopy?: (index: number) => void
  onRemove?: (index: number) => void
  onMoveDown?: (index: number) => void
  onMoveUp?: (index: number) => void
}

const ArrayBaseContext = createContext<IArrayBaseContext | null>(null)

const ItemContext = createContext<IArrayBaseItemProps | null>(null)

const takeRecord = (val: any, index?: number) => (typeof val === 'function' ? val(index) : val)

export const useArray = () => {
  return useContext(ArrayBaseContext)
}

export const useIndex = (index?: number) => {
  const ctx = useContext(ItemContext)
  return (ctx ? ctx.index : index) || 0
}

export const useRecord = (record?: number) => {
  const ctx = useContext(ItemContext)
  return takeRecord(ctx ? ctx.record : record, ctx?.index)
}

const getSchemaDefaultValue = (schema?: Schema): any => {
  if (schema?.type === 'array') return []
  if (schema?.type === 'object') return {}
  if (schema?.type === 'void') {
    for (const key in schema.properties) {
      const value = getSchemaDefaultValue(schema.properties[key])
      if (isValid(value)) return value
    }
  }
}

const getDefaultValue = (defaultValue: any, schema: Schema) => {
  if (isValid(defaultValue)) return clone(defaultValue)
  if (Array.isArray(schema?.items)) return getSchemaDefaultValue(schema?.items[0])
  return getSchemaDefaultValue(schema?.items)
}

const InternalArrayBase: ReactFC<IArrayBaseProps> = props => {
  const field = useField<ArrayField>()
  const schema = useFieldSchema()
  const contextValue = useMemo(
    () => ({ field: field as ArrayField, schema: schema as Schema, props }),
    [field, schema, props]
  )
  if (!field || !schema) return null
  return <ArrayBaseContext.Provider value={contextValue}>{props.children}</ArrayBaseContext.Provider>
}

export const ArrayBaseItem: ReactFC<IArrayBaseItemProps> = ({ children, ...props }) => {
  return <ItemContext.Provider value={props}>{children}</ItemContext.Provider>
}

const InternalSortHandle = SortableHandle(props => {
  const prefixCls = usePrefixCls('formvk-array-base')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <MenuOutlined
      {...props}
      className={cls(`${prefixCls}-sort-handle`, hashId, props.className)}
      style={{ ...props.style }}
    />
  )
})

export const SortHandle = observer<CommonProps>(props => {
  const array = useArray()
  if (!array) return null
  if (array.field?.pattern !== 'editable') return null
  return <InternalSortHandle {...props} />
})

export const Index: FC<HTMLAttributes<HTMLSpanElement>> = props => {
  const index = useIndex()
  const prefixCls = usePrefixCls('formvk-array-base')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <span {...props} className={cls(`${prefixCls}-index`, hashId)}>
      #{(index || 0) + 1}.
    </span>
  )
}

export const Addition = observer<IAdditionProps>(props => {
  const self = useField()
  const array = useArray()
  const prefixCls = usePrefixCls('formvk-array-base')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  if (!array) return null
  if (array.field?.pattern !== 'editable' && array.field?.pattern !== 'disabled') return null
  return wrapSSR(
    <Button
      type="dashed"
      block
      {...props}
      disabled={self?.disabled}
      className={cls(`${prefixCls}-addition`, hashId, props.className)}
      onClick={e => {
        if (array.props?.disabled) return
        const defaultValue = getDefaultValue(props.defaultValue, array.schema)
        if (props.method === 'unshift') {
          array.field?.unshift?.(defaultValue)
          array.props?.onAdd?.(0)
        } else {
          array.field?.push?.(defaultValue)
          array.props?.onAdd?.((array?.field?.value?.length ?? 0) - 1)
        }
        if (props.onClick) {
          props.onClick(e)
        }
      }}
      icon={isUndef(props.icon) ? <PlusOutlined /> : props.icon}
    >
      {props.title || self?.title}
    </Button>
  )
})
export const Copy = observer<CommonProps & { ref?: Ref<HTMLButtonElement> }, { forwardRef: true }>(
  ({ ref, ...props }) => {
    const self = useField()
    const array = useArray()
    const index = useIndex(props.index) || 0
    const prefixCls = usePrefixCls('formvk-array-base')
    const [wrapSSR, hashId] = useStyle(prefixCls)
    if (!array) return null
    if (array.field?.pattern !== 'editable') return null
    return wrapSSR(
      <Button
        type="text"
        {...props}
        style={{
          padding: '0 0 0 6px',
          width: 'auto',
          height: 'auto',
          ...props.style,
        }}
        disabled={self?.disabled}
        className={cls(
          `${prefixCls}-copy`,
          hashId,
          self?.disabled ? `${prefixCls}-copy-disabled` : '',
          props.className
        )}
        ref={ref}
        onClick={e => {
          if (self?.disabled) return
          e.stopPropagation()
          if (array.props?.disabled) return
          if (props.onClick) {
            props.onClick(e)
            if (e.defaultPrevented) return
          }
          const value = clone(array?.field?.value?.[index])
          const distIndex = index + 1
          array.field?.insert?.(distIndex, value)
          array.props?.onCopy?.(distIndex)
        }}
        icon={isUndef(props.icon) ? <CopyOutlined /> : props.icon}
      >
        {props.title || self?.title}
      </Button>
    )
  },
  { forwardRef: true }
)

export const Remove = observer<CommonProps & { ref?: Ref<HTMLButtonElement> }, { forwardRef: true }>(
  ({ ref, ...props }) => {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('formvk-array-base')
    const [wrapSSR, hashId] = useStyle(prefixCls)

    if (!array) return null
    if (array.field?.pattern !== 'editable') return null
    return wrapSSR(
      <Button
        type="text"
        {...props}
        style={{
          padding: '0 0 0 6px',
          width: 'auto',
          height: 'auto',
          ...props.style,
        }}
        disabled={self?.disabled}
        className={cls(
          `${prefixCls}-remove`,
          hashId,
          self?.disabled ? `${prefixCls}-remove-disabled` : '',
          props.className
        )}
        ref={ref}
        onClick={e => {
          if (self?.disabled) return
          e.stopPropagation()
          if (props.onClick) {
            props.onClick(e)
            if (e.defaultPrevented) return
          }
          array.field?.remove?.(index)
          array.props?.onRemove?.(index)
        }}
        icon={isUndef(props.icon) ? <DeleteOutlined /> : props.icon}
      >
        {props.title || self?.title}
      </Button>
    )
  },
  { forwardRef: true }
)

export const MoveDown = observer<CommonProps & { ref?: Ref<HTMLButtonElement> }, { forwardRef: true }>(
  ({ ref, ...props }) => {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('formvk-array-base')
    if (!array) return null
    if (array.field?.pattern !== 'editable') return null
    return (
      <Button
        type="text"
        {...props}
        style={{
          padding: '0 0 0 6px',
          width: 'auto',
          height: 'auto',
          ...props.style,
        }}
        disabled={self?.disabled}
        className={cls(
          `${prefixCls}-move-down`,
          self?.disabled ? `${prefixCls}-move-down-disabled` : '',
          props.className
        )}
        ref={ref}
        onClick={e => {
          if (self?.disabled) return
          e.stopPropagation()
          if (props.onClick) {
            props.onClick(e)
            if (e.defaultPrevented) return
          }
          array.field?.moveDown?.(index)
          array.props?.onMoveDown?.(index)
        }}
        icon={isUndef(props.icon) ? <DownOutlined /> : props.icon}
      >
        {props.title || self?.title}
      </Button>
    )
  },
  { forwardRef: true }
)

export const MoveUp = observer<CommonProps & { ref?: Ref<HTMLButtonElement> }, { forwardRef: true }>(
  ({ ref, ...props }) => {
    const index = useIndex(props.index)
    const self = useField()
    const array = useArray()
    const prefixCls = usePrefixCls('formvk-array-base')
    if (!array) return null
    if (array.field?.pattern !== 'editable') return null
    return (
      <Button
        type="text"
        {...props}
        style={{
          padding: '0 0 0 6px',
          width: 'auto',
          height: 'auto',
          ...props.style,
        }}
        disabled={self?.disabled}
        className={cls(`${prefixCls}-move-up`, self?.disabled ? `${prefixCls}-move-up-disabled` : '', props.className)}
        ref={ref}
        onClick={e => {
          if (self?.disabled) return
          e.stopPropagation()
          if (props.onClick) {
            props.onClick(e)
            if (e.defaultPrevented) return
          }
          array?.field?.moveUp(index)
          array?.props?.onMoveUp?.(index)
        }}
        icon={isUndef(props.icon) ? <UpOutlined /> : props.icon}
      >
        {props.title || self?.title}
      </Button>
    )
  },
  { forwardRef: true }
)

export const ArrayBase = InternalArrayBase
