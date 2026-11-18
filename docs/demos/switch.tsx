import { Form, FormItem, Switch } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Switch },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  basic: f.Switch({ title: '基础开关' }),
  text: f.Switch({
    title: '带文案',
    componentProps: { checkedChildren: '开', unCheckedChildren: '关' },
  }),
  disabled: f.Switch({ title: '禁用', componentProps: { disabled: true } }),
})

export default () => {
  const [form] = useState(() => createForm({ values: { basic: true, text: true, disabled: false } }))

  return (
    <Form form={form} layout="vertical">
      <SchemaField schema={schema} />
    </Form>
  )
}
