import { Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  normal: f.Input({ title: '默认' }),
  tooltip: f.Input({ title: '提示文本布局', decoratorProps: { tooltip: '鼠标悬浮查看提示' } }),
  error: f.Input({ title: '校验反馈', decoratorProps: { feedbackStatus: 'error', feedbackText: '出错了' } }),
})

export default () => {
  const [form] = useState(() => createForm())

  return (
    <Form
      form={form}
      layout="vertical"
      size="large"
      feedbackLayout="terse"
      tooltipLayout="text"
      bordered
      inset
      fullness
    >
      <SchemaField schema={schema} />
    </Form>
  )
}
