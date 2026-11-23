import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observable } from '@formvk/reactive'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { Schema, SchemaKey } from '@formvk/schema'
import { toArr } from '@formvk/shared'
import { Badge, Collapse } from 'antd'
import type { CollapseProps } from 'antd/es/collapse'
import cls from 'classnames'
import { useState } from 'react'

import { isComponentOf, usePrefixCls } from '../../shared'

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
  const panels: { name: SchemaKey; key: SchemaKey; props: any; schema: Schema }[] = []
  if (!collapseField || !schema) return panels
  schema.mapProperties((panelSchema, name) => {
    const field = collapseField.query(collapseField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden') return
    if (isComponentOf(panelSchema.component, 'CollapsePanel')) {
      const props = {
        ...panelSchema?.componentProps,
        ...field?.componentProps,
      }
      const key = props.key || name
      // key 需要作为 JSX 属性单独传入，留在 props 中会被 spread 进组件触发 React 告警
      delete props.key
      panels.push({ name, key, props, schema: panelSchema })
    }
  })
  return panels
}

// formvk reactive 无 model/markRaw：observable 承载状态，方法闭包自引用
export const createFormCollapse = (defaultActiveKeys?: ActiveKeys): IFormCollapse => {
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
      } else if (formCollapse.activeKeys === key) {
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
        formCollapse.activeKeys = formCollapse.activeKeys.filter(item => item !== key)
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

const InternalFormCollapse: ReactFC<IFormCollapseProps> = observer(props => {
  const { formCollapse, children: _children, ...rest } = props
  const field = useField()
  const panels = usePanels()
  const prefixCls = usePrefixCls('formvk-collapse', rest)
  // 对齐参考实现 useMemo 惰性创建：外部未传入时使用内部兜底实例
  const [fallbackCollapse] = useState<IFormCollapse>(() => createFormCollapse(rest.defaultActiveKey))
  const mergedFormCollapse = formCollapse ?? fallbackCollapse

  const takeActiveKeys = () => {
    if (rest.activeKey) return rest.activeKey
    if (mergedFormCollapse?.activeKeys) return mergedFormCollapse?.activeKeys
    if (rest.accordion) return panels[0]?.key
    return panels.map(item => item.key)
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
      {...rest}
      className={cls(prefixCls, rest.className)}
      activeKey={takeActiveKeys()}
      onChange={key => {
        rest.onChange?.(key)
        mergedFormCollapse?.setActiveKeys?.(key)
      }}
      items={
        // 复制而不是原地修改，避免污染 schema 上的 props
        // oxlint-disable-next-line no-map-spread
        panels.map(({ props: panelProps, schema, name, key }) => ({
          ...panelProps,
          key,
          forceRender: true,
          label: badgedHeader(name, panelProps),
          children: <RecursionField schema={schema} name={name} />,
        }))
      }
    />
  )
})

export const FormCollapse = InternalFormCollapse
