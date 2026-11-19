import type { ArrayField } from '@formvk/core'
import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { ISchema } from '@formvk/schema'
import { toArr } from '@formvk/shared'
import { Badge, Card, Collapse, Empty } from 'antd'
import type { CollapsePanelProps, CollapseProps } from 'antd/es/collapse'
import cls from 'classnames'
import { useEffect, useState } from 'react'

import { isComponentOf, usePrefixCls } from '../../shared'
import { ArrayBase, ArrayBaseItem } from '../array-base'
import { useStyle } from './style'

export interface IArrayCollapseProps extends CollapseProps {
  defaultOpenPanelCount?: number
}

const isAdditionComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Addition')
}

const isIndexComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Index')
}

const isRemoveComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'Remove')
}

const isMoveUpComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'MoveUp')
}

const isMoveDownComponent = (schema: ISchema) => {
  return isComponentOf(schema.component, 'MoveDown')
}

const isOperationComponent = (schema: ISchema) => {
  return (
    isAdditionComponent(schema) || isRemoveComponent(schema) || isMoveDownComponent(schema) || isMoveUpComponent(schema)
  )
}

const takeDefaultActiveKeys = (field: ArrayField, defaultOpenPanelCount: number) => {
  const dataSource = Array.isArray(field.value) ? field.value : []
  return dataSource.slice(0, defaultOpenPanelCount).map((_, index) => String(field.getRecordKey(index)))
}

const insertActiveKeys = (activeKeys: string[], index: number) => {
  if (activeKeys.length <= index) return activeKeys.concat(String(index))
  return activeKeys.reduce<string[]>((buf, key) => {
    const keyIndex = Number(key)
    if (keyIndex < index) return buf.concat(key)
    if (keyIndex === index) return buf.concat([key, String(keyIndex + 1)])
    return buf.concat(String(keyIndex + 1))
  }, [])
}

const InternalArrayCollapse: ReactFC<IArrayCollapseProps> = observer((props: IArrayCollapseProps) => {
  const field = useField<ArrayField>()
  if (!field) return null
  const dataSource = Array.isArray(field.value) ? field.value : []
  const [activeKeys, setActiveKeys] = useState<string[]>(() =>
    takeDefaultActiveKeys(field, props.defaultOpenPanelCount ?? 5)
  )
  const schema = useFieldSchema()
  const prefixCls = usePrefixCls('formvk-array-collapse', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  useEffect(() => {
    if (!field.modified && dataSource.length) {
      setActiveKeys(takeDefaultActiveKeys(field, props.defaultOpenPanelCount ?? 5))
    }
  }, [dataSource.length, field, props.defaultOpenPanelCount])
  if (!schema) throw new Error('can not found schema object')

  const renderAddition = () => {
    return schema.reduceProperties((addition, propertySchema, key) => {
      if (isAdditionComponent(propertySchema)) {
        return <RecursionField schema={propertySchema} name={key} />
      }
      return addition
    }, null)
  }
  const renderEmpty = () => {
    if (dataSource.length) return
    return (
      <Card className={cls(`${prefixCls}-item`, hashId, props.className)}>
        <Empty />
      </Card>
    )
  }

  const renderItems = () => {
    return (
      <Collapse
        {...props}
        activeKey={activeKeys}
        onChange={(keys: string[]) => {
          setActiveKeys(toArr(keys))
        }}
        className={cls(`${prefixCls}-item`, hashId, props.className)}
        items={dataSource.flatMap((item, index) => {
          const items = Array.isArray(schema.items) ? schema.items[index] || schema.items[0] : schema.items

          if (!items) return []
          const panelProps = field.query(`${field.address}.${index}`).get('componentProps')
          const panelSchemaProps: CollapsePanelProps = items.componentProps
          const header = () => {
            const headerText = panelProps?.header || panelSchemaProps.header || field.title

            const path = field.address.concat(index)
            const errors = field.form.queryFeedbacks({
              type: 'error',
              address: `${path}.**`,
            })
            return (
              <ArrayBaseItem index={index} record={() => field.value?.[index]}>
                <RecursionField
                  schema={items}
                  name={index}
                  filterProperties={propertySchema => {
                    if (!isIndexComponent(propertySchema)) return false
                    return true
                  }}
                  onlyRenderProperties
                />
                {errors.length ? (
                  <Badge size="small" className="errors-badge" count={errors.length}>
                    {headerText}
                  </Badge>
                ) : (
                  headerText
                )}
              </ArrayBaseItem>
            )
          }

          const extra = (
            <ArrayBaseItem index={index} record={item}>
              {panelProps?.extra}
              <RecursionField
                schema={items}
                name={index}
                filterProperties={propertySchema => {
                  if (!isOperationComponent(propertySchema)) return false
                  return true
                }}
                onlyRenderProperties
              />
            </ArrayBaseItem>
          )

          const content = (
            <RecursionField
              schema={items}
              name={index}
              filterProperties={propertySchema => {
                if (isIndexComponent(propertySchema)) return false
                if (isOperationComponent(propertySchema)) return false
                return true
              }}
            />
          )
          // 数组项 key 由字段的 recordKey 解析，未配置时回退到索引
          return [
            {
              ...panelSchemaProps,
              ...panelProps,
              forceRender: true,
              key: String(field.getRecordKey(index)),
              label: header(),
              extra,
              children: (
                <ArrayBaseItem index={index} record={item}>
                  {content}
                </ArrayBaseItem>
              ),
            },
          ]
        })}
      />
    )
  }
  return wrapSSR(
    <ArrayBase
      onAdd={index => {
        if (field.recordKey) {
          const key = String(field.getRecordKey(index))
          setActiveKeys(keys => (keys.includes(key) ? keys : keys.concat(key)))
          return
        }
        setActiveKeys(keys => insertActiveKeys(keys, index))
      }}
    >
      {renderEmpty()}
      {renderItems()}
      {renderAddition()}
    </ArrayBase>
  )
})

export const ArrayCollapse = InternalArrayCollapse
