import { Form, FormItem, Input, Space } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { Button } from 'antd'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  email: f.Input({ title: '邮箱' }),
})

export default () => {
  const [form] = useState(() => createForm())

  return (
    <Form form={form} layout="vertical" spaceGap={24}>
      <SchemaField schema={schema} />
      {/* 未显式设置 size 时，Space 使用 FormLayout.spaceGap（下面设置为 24） */}
      <Space>
        <Button type="primary">默认间距</Button>
        <Button>跟随布局</Button>
      </Space>
      <Space size={4} style={{ marginTop: 12 }}>
        <Button>size 4</Button>
        <Button>size 4</Button>
      </Space>
      <Space size={32} style={{ marginTop: 12 }}>
        <Button>size 32</Button>
        <Button>size 32</Button>
      </Space>
    </Form>
  )
}
