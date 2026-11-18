import { Form, FormGrid, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, FormGrid },
  defaultDecorator: 'FormItem',
})

const fields = ['name', 'email', 'mobile', 'company', 'city', 'remark'] as const
const titles = ['姓名', '邮箱', '手机号', '公司', '城市', '备注']

const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      minWidth: 200,
      minColumns: 1,
      maxColumns: 3,
      colWrap: true,
    },
    properties: Object.fromEntries(fields.map((key, index) => [key, f.Input({ title: titles[index] })])),
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
