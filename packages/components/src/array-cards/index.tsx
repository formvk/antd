import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { ISchema } from '@formvk/schema'
import { Card, Empty } from 'antd'
import type { CardProps } from 'antd/es/card'
import cls from 'classnames'

import { ArrayItemField, isComponentOf, usePrefixCls } from '../__builtins__'
import { ArrayBase, ArrayBaseItem } from '../array-base'
import { useStyle } from './style'

const isAdditionComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Addition')
}

const isIndexComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Index')
}

const isRemoveComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Remove')
}

const isCopyComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Copy')
}

const isMoveUpComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'MoveUp')
}

const isMoveDownComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'MoveDown')
}

const isOperationComponent = (schema: ISchema) => {
  return (
    isAdditionComponent(schema) ||
    isRemoveComponent(schema) ||
    isCopyComponent(schema) ||
    isMoveDownComponent(schema) ||
    isMoveUpComponent(schema)
  )
}

export const ArrayCards: ReactFC<CardProps> = observer(props => {
  const field = useField<ArrayField>()
  const schema = useFieldSchema()
  if (!field) return null
  const dataSource = Array.isArray(field.value) ? field.value : []
  const prefixCls = usePrefixCls('formvk-array-cards', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  if (!schema) throw new Error('can not found schema object')

  const renderItems = () => {
    return dataSource?.map((_, index) => {
      const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items
      const title = (
        <span>
          {items ? (
            <RecursionField
              schema={items}
              name={index}
              filterProperties={propertySchema => {
                if (!isIndexComponent(propertySchema)) return false
                return true
              }}
              onlyRenderProperties
            />
          ) : null}
          {props.title || field.title}
        </span>
      )
      const extra = (
        <span>
          {items ? (
            <RecursionField
              schema={items}
              name={index}
              filterProperties={propertySchema => {
                if (!isOperationComponent(propertySchema)) return false
                return true
              }}
              onlyRenderProperties
            />
          ) : null}
          {props.extra}
        </span>
      )
      const content = items ? (
        <ArrayItemField
          schema={items}
          index={index}
          filterProperties={propertySchema => {
            if (isIndexComponent(propertySchema)) return false
            if (isOperationComponent(propertySchema)) return false
            return true
          }}
        />
      ) : null
      return (
        // 数组项 key 由字段的 recordKey 解析，未配置时回退到索引
        <ArrayBaseItem key={field.getRecordKey(index)} index={index} record={() => field.value?.[index]}>
          <Card
            {...props}
            onChange={() => {}}
            className={cls(`${prefixCls}-item`, hashId, props.className)}
            title={title}
            extra={extra}
          >
            {content}
          </Card>
        </ArrayBaseItem>
      )
    })
  }

  const renderAddition = () => {
    return schema.reduceProperties((addition, propertySchema, key) => {
      if (isAdditionComponent(propertySchema)) {
        return <RecursionField schema={propertySchema} name={key} />
      }
      return addition
    }, null)
  }

  const renderEmpty = () => {
    if (dataSource?.length) return
    return (
      <Card
        {...props}
        onChange={() => {}}
        className={cls(`${prefixCls}-item`, hashId, props.className)}
        title={props.title || field.title}
      >
        <Empty />
      </Card>
    )
  }

  return wrapSSR(
    <ArrayBase>
      {renderEmpty()}
      {renderItems()}
      {renderAddition()}
    </ArrayBase>
  )
})
