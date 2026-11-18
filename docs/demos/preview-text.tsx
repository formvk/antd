import { Form, FormItem, Input, Placeholder, Select, Text } from '@formvk/antd'
import { createForm, createSchema, createSchemaField, observer } from '@formvk/react'
import { Switch } from 'antd'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, Select },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  company: f.Input({ title: '公司' }),
})

export default observer(() => {
  const [form] = useState(() =>
    createForm({ pattern: 'readPretty', values: { name: 'Alice', role: 'admin', company: '' } })
  )

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <Form form={form} layout="vertical" previewTextPlaceholder="—">
        <SchemaField schema={schema} />
      </Form>
      <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Switch
          checked={form.readPretty}
          onChange={checked => {
            form.readPretty = checked
          }}
        />
        切换阅读态（空值展示 previewTextPlaceholder）
      </label>
      <div>
        占位符上下文：
        <Placeholder value="N/A">
          <Text value={undefined} />
        </Placeholder>
      </div>
    </div>
  )
})
