import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { ISchema } from '@formvk/schema'
import cls from 'classnames'
import type { HTMLAttributes } from 'react'

import { isComponentOf, SortableContainer, SortableElement, usePrefixCls } from '../../shared'
import { ArrayBase, ArrayBaseItem } from '../array-base'
import { useStyle } from './style'

const SortableItem = SortableElement(props => {
  const prefixCls = usePrefixCls('formvk-array-items')
  const [wrapSSR, hashId] = useStyle(prefixCls)

  return wrapSSR(
    <div {...props} className={cls(`${prefixCls}-item`, hashId, props.className)}>
      {props.children}
    </div>
  )
})

const SortableList = SortableContainer(props => {
  const prefixCls = usePrefixCls('formvk-array-items')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <div {...props} className={cls(`${prefixCls}-list`, hashId, props.className)}>
      {props.children}
    </div>
  )
})

const isAdditionComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Addition')
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

const InternalArrayItems: ReactFC<HTMLAttributes<HTMLDivElement>> = observer(props => {
  const field = useField<ArrayField>()
  const prefixCls = usePrefixCls('formvk-array-items')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const schema = useFieldSchema()
  const addition = useAddition()
  if (!field) return null
  if (!schema) throw new Error('can not found schema object')
  const dataSource = Array.isArray(field.value) ? field.value : []
  return wrapSSR(
    <ArrayBase>
      <div {...props} onChange={() => {}} className={cls(prefixCls, hashId, props.className)}>
        <SortableList
          list={dataSource.slice()}
          className={`${prefixCls}-sort-helper`}
          onSortEnd={event => {
            const { oldIndex, newIndex } = event
            field.move(oldIndex, newIndex)
          }}
        >
          {dataSource?.map((_, index) => {
            const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items
            return (
              // 数组项 key 由字段的 recordKey 解析，未配置时回退到索引
              <ArrayBaseItem key={field.getRecordKey(index)} index={index} record={() => field.value?.[index]}>
                <SortableItem lockAxis="y" index={index}>
                  <div className={`${prefixCls}-item-inner`}>
                    {items ? <RecursionField schema={items} name={index} /> : null}
                  </div>
                </SortableItem>
              </ArrayBaseItem>
            )
          })}
        </SortableList>
        {addition}
      </div>
    </ArrayBase>
  )
})

export const ArrayItemsItem: ReactFC<
  HTMLAttributes<HTMLDivElement> & {
    type?: 'card' | 'divide'
  }
> = props => {
  const prefixCls = usePrefixCls('formvk-array-items')
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <div
      {...props}
      onChange={() => {}}
      className={cls(`${prefixCls}-${props.type || 'card'}`, hashId, props.className)}
    >
      {props.children}
    </div>
  )
}

export const ArrayItems = InternalArrayItems
