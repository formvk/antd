import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  email: f.Input({ title: '邮箱' }),
  mobile: f.Input({ title: '手机号' }),
  x: f.Input({ title: 'X 坐标' }),
  y: f.Input({ title: 'Y 坐标' }),
})

export default () => {
  const [form] = useState(() => createForm())

  return (
    <OptionsProvider>
      <Form form={form} labelCol={4} wrapperCol={8} layout="horizontal">
        <SchemaField schema={schema} />
      </Form>
    </OptionsProvider>
  )
}
