import { Form, FormGrid, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, FormGrid },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  grid: f.FormGrid({
    componentProps: {
      minWidth: 180,
      maxWidth: 260,
      maxColumns: 4,
      columnGap: 16,
      rowGap: 8,
      strictAutoFit: true,
      colWrap: true,
    },
    properties: {
      name: f.Input({ title: '姓名' }),
      email: f.Input({ title: '邮箱（gridSpan 2）', decoratorProps: { gridSpan: 2 } }),
      mobile: f.Input({ title: '手机号' }),
      company: f.Input({ title: '公司' }),
      city: f.Input({ title: '城市' }),
      address: f.Input({ title: '地址（gridSpan 3）', decoratorProps: { gridSpan: 3 } }),
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
