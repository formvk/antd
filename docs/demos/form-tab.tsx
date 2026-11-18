import { Form, FormItem, FormTab, FormTabPane, Input, Password } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, Password },
  voidComponents: {
    FormItem,
    FormTab,
    TabPane: FormTabPane,
  },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  tabs: f.FormTab({
    properties: {
      user: f.TabPane({
        componentProps: { key: 'user', tab: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
          email: f.Input({ title: '邮箱' }),
          city: f.Input({ title: '城市' }),
        },
      }),
      security: f.TabPane({
        componentProps: { key: 'security', tab: '账号安全' },
        properties: {
          password: f.Password({ title: '密码' }),
          confirm: f.Password({ title: '确认密码' }),
        },
      }),
    },
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
