import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
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

const Demo = () => {
  const [form] = useState(() => createForm({ values: { basic: true, text: true, disabled: false } }))

  return (
    <OptionsProvider>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
