import { RecursionField, useField, useFieldSchema } from '@formvk/react'
import { observable } from '@formvk/reactive'
import { observer } from '@formvk/reactive-react'
import type { ReactFC } from '@formvk/reactive-react'
import type { Schema, SchemaKey } from '@formvk/schema'
import { Badge, Tabs } from 'antd'
import type { TabPaneProps, TabsProps } from 'antd/es/tabs'
import cls from 'classnames'
import { Fragment, useState } from 'react'
import type { FC, PropsWithChildren, ReactNode } from 'react'

import { isComponentOf, usePrefixCls } from '../__builtins__'

export interface IFormTab {
  activeKey?: string
  setActiveKey(key: string): void
}

export interface IFormTabProps extends TabsProps {
  formTab?: IFormTab
}

export interface IFormTabPaneProps extends TabPaneProps {
  key: string | number
}

interface IFeedbackBadgeProps {
  name: SchemaKey
  tab: ReactNode
}

const useTabs = () => {
  const tabsField = useField()
  const schema = useFieldSchema()
  const tabs: { name: SchemaKey; props: any; schema: Schema }[] = []
  if (!tabsField || !schema) return tabs
  schema.mapProperties((tabSchema, name) => {
    const field = tabsField.query(tabsField.address.concat(name)).take()
    if (field?.display === 'none' || field?.display === 'hidden') return
    if (isComponentOf(tabSchema.component, 'TabPane')) {
      const key = field?.componentProps?.key || tabSchema?.componentProps?.key || name
      tabs.push({
        name,
        props: {
          ...tabSchema?.componentProps,
          ...field?.componentProps,
          key,
        },
        schema: tabSchema,
      })
    }
  })
  return tabs
}

const FeedbackBadge: ReactFC<IFeedbackBadgeProps> = observer(props => {
  const field = useField()
  if (!field) return <Fragment>{props.tab}</Fragment>
  const errors = field.form.queryFeedbacks({
    type: 'error',
    address: `${field.address.concat(props.name)}.*`,
  })
  if (errors.length) {
    return (
      <Badge size="small" className="errors-badge" count={errors.length}>
        {props.tab}
      </Badge>
    )
  }
  return <Fragment>{props.tab}</Fragment>
})

// formvk reactive 无 model/markRaw：用 observable 直接承载状态，方法内写操作即响应式
export const createFormTab = (defaultActiveKey?: string): IFormTab => {
  const formTab = observable({
    activeKey: defaultActiveKey,
    setActiveKey(key: string) {
      formTab.activeKey = key
    },
  })
  return formTab
}

export const FormTab: ReactFC<IFormTabProps> = observer(({ formTab, ...props }: IFormTabProps) => {
  const tabs = useTabs()
  // 对齐参考实现 useMemo 惰性创建：仅在外部未传入 formTab 时使用内部兜底实例
  const [fallbackTab] = useState<IFormTab>(() => createFormTab())
  const mergedFormTab = formTab ?? fallbackTab
  const prefixCls = usePrefixCls('formvk-tab', props)
  const activeKey = props.activeKey || mergedFormTab?.activeKey

  return (
    <Tabs
      {...props}
      className={cls(prefixCls, props.className)}
      activeKey={activeKey}
      onChange={key => {
        props.onChange?.(key)
        mergedFormTab?.setActiveKey?.(key)
      }}
      items={tabs.map(({ props: tabProps, schema, name }, key) =>
        Object.assign(
          {
            key,
            label: <FeedbackBadge name={name} tab={tabProps.tab} />,
          },
          tabProps,
          { children: <RecursionField schema={schema} name={name} /> }
        )
      )}
    />
  )
})

export const FormTabPane: FC<PropsWithChildren<IFormTabPaneProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>
}
