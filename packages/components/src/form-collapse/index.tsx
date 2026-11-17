import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observable } from '@formvk/reactive'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { Schema, SchemaKey } from '@formvk/schema'
import { toArr } from '@formvk/shared'
import { Badge, Collapse } from 'antd'
import type { CollapsePanelProps, CollapseProps } from 'antd/es/collapse'
import cls from 'classnames'
import React, { Fragment, useState } from 'react'

import { isComponentOf, usePrefixCls } from '../__builtins__'

type ActiveKeys = string | number | Array<string | number>

type ActiveKey = string | number
export interface IFormCollapse {
  activeKeys: ActiveKeys
  hasActiveKey(key: ActiveKey): boolean
  setActiveKeys(key: ActiveKeys): void
  addActiveKey(key: ActiveKey): void
  removeActiveKey(key: ActiveKey): void
  toggleActiveKey(key: ActiveKey): void
}

export interface IFormCollapseProps extends CollapseProps {
  formCollapse?: IFormCollapse
}

const usePanels = () => {
  const collapseField = useField()
  const schema = useFieldSchema()
  const panels: { name: SchemaKey; props: any; schema: Schema }[] = []
  if (!collapseField || !schema) return panels
  schema.mapProperties((schema, name) => {
    const field = collapseField.query(collapseField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden') return
    if (isComponentOf(schema.component, 'CollapsePanel')) {
      const key = field?.componentProps?.key || schema?.componentProps?.key || name
      panels.push({
        name,
        props: {
          ...schema?.componentProps,
          ...field?.componentProps,
          key,
        },
        schema,
      })
    }
  })
  return panels
}

// formvk reactive 无 model/markRaw：observable 承载状态，方法闭包自引用
const createFormCollapse = (defaultActiveKeys?: ActiveKeys): IFormCollapse => {
  const formCollapse = observable({
    activeKeys: defaultActiveKeys as ActiveKeys,
    setActiveKeys(keys: ActiveKeys) {
      formCollapse.activeKeys = keys
    },
    hasActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        if (formCollapse.activeKeys.includes(key)) {
          return true
        }
      } else if (formCollapse.activeKeys == key) {
        return true
      }
      return false
    },
    addActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) return
      formCollapse.activeKeys = toArr(formCollapse.activeKeys).concat(key)
    },
    removeActiveKey(key: ActiveKey) {
      if (Array.isArray(formCollapse.activeKeys)) {
        formCollapse.activeKeys = formCollapse.activeKeys.filter(item => item != key)
      } else {
        formCollapse.activeKeys = ''
      }
    },
    toggleActiveKey(key: ActiveKey) {
      if (formCollapse.hasActiveKey(key)) {
        formCollapse.removeActiveKey(key)
      } else {
        formCollapse.addActiveKey(key)
      }
    },
  })
  return formCollapse
}

const InternalFormCollapse: ReactFC<IFormCollapseProps> = observer(({ formCollapse, ...props }) => {
  const field = useField()
  const panels = usePanels()
  const prefixCls = usePrefixCls('formvk-collapse', props)
  // 对齐参考实现 useMemo 惰性创建：外部未传入时使用内部兜底实例
  const [fallbackCollapse] = useState<IFormCollapse>(() => createFormCollapse(props.defaultActiveKey))
  const mergedFormCollapse = formCollapse ?? fallbackCollapse

  const takeActiveKeys = () => {
    if (props.activeKey) return props.activeKey
    if (mergedFormCollapse?.activeKeys) return mergedFormCollapse?.activeKeys
    if (props.accordion) return panels[0]?.name
    return panels.map(item => item.name)
  }

  const badgedHeader = (key: SchemaKey, panelProps: any) => {
    if (!field) return panelProps.header
    const errors = field.form.queryFeedbacks({
      type: 'error',
      address: `${field.address.concat(key)}.*`,
    })
    if (errors.length) {
      return (
        <Badge size="small" className="errors-badge" count={errors.length}>
          {panelProps.header}
        </Badge>
      )
    }
    return panelProps.header
  }
  return (
    <Collapse
      {...props}
      className={cls(prefixCls, props.className)}
      activeKey={takeActiveKeys()}
      onChange={key => {
        props?.onChange?.(key)
        mergedFormCollapse?.setActiveKeys?.(key)
      }}
    >
      {panels.map(({ props: panelProps, schema, name }, index) => (
        <Collapse.Panel key={index} {...panelProps} header={badgedHeader(name, panelProps)} forceRender>
          <RecursionField schema={schema} name={name} />
        </Collapse.Panel>
      ))}
    </Collapse>
  )
})

const CollapsePanel: React.FC<React.PropsWithChildren<CollapsePanelProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>
}

export const FormCollapse = Object.assign(InternalFormCollapse, {
  CollapsePanel,
  createFormCollapse,
})

export default FormCollapse
