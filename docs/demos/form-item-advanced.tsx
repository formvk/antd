import { Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

// 自定义 tooltipIcon，任意 ReactNode 均可
const QuestionCircleFilled = () => (
  <span
    style={{
      display: 'inline-flex',
      width: 14,
      height: 14,
      borderRadius: '50%',
      background: '#faad14',
      color: '#fff',
      fontSize: 10,
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    ?
  </span>
)

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  vertical: f.Input({
    title: '单项 vertical 布局',
    decoratorProps: { layout: 'vertical' },
  }),
  size: f.Input({
    title: '单项 size',
    decoratorProps: { size: 'large' },
  }),
  tooltipText: f.Input({
    title: 'tooltipLayout=text',
    decoratorProps: { tooltip: '提示直接用文本展示', tooltipLayout: 'text' },
  }),
  tooltipIcon: f.Input({
    title: '自定义 tooltipIcon',
    decoratorProps: {
      tooltip: '自定义图标',
      tooltipIcon: <QuestionCircleFilled />,
    },
  }),
  col: f.Input({
    title: 'labelCol / wrapperCol',
    decoratorProps: { labelCol: 6, wrapperCol: 10 },
  }),
  style: f.Input({
    title: 'labelStyle / wrapperStyle',
    decoratorProps: {
      labelStyle: { color: '#1677ff' },
      wrapperStyle: { background: 'rgba(22, 119, 255, 0.06)', padding: 4, borderRadius: 4 },
    },
  }),
  popover: f.Input({
    title: 'getPopupContainer',
    decoratorProps: {
      feedbackLayout: 'popover',
      feedbackStatus: 'error',
      feedbackText: '通过 getPopupContainer 指定浮层挂载节点',
      getPopupContainer: (node: HTMLElement) => node.parentElement ?? document.body,
    },
  }),
})

export default () => {
  const [form] = useState(() => createForm())

  return (
    <Form form={form} className="form-item-advanced" style={{ padding: 8 }}>
      <SchemaField schema={schema} />
    </Form>
  )
}
