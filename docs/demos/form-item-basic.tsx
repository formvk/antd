import { Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  normal: f.Input({
    title: '默认 label',
    decoratorProps: { extra: 'extra 会渲染在控件下方' },
  }),
  tooltip: f.Input({
    title: '带提示',
    decoratorProps: { tooltip: 'tooltip 会渲染为 label 后的问号图标' },
  }),
  colon: f.Input({
    title: '隐藏冒号',
    decoratorProps: { colon: false },
  }),
  noLabel: f.Input({
    title: '隐藏 label',
    decoratorProps: { label: ' ' },
  }),
  asterisk: f.Input({
    title: '自定义必填星号',
    required: false,
    decoratorProps: { asterisk: true },
  }),
})

export default () => {
  const [form] = useState(() => createForm())

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
    </Form>
  )
}
