import { Editable, EditablePopover, Form, FormItem, Input } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, Editable, EditablePopover },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名', decorator: 'Editable' }),
  email: f.Input({ title: '邮箱', decorator: 'Editable' }),
  // 容器级编辑：点击标题后在 Popover 中编辑子字段
  profile: f.Object(
    {
      birthday: f.Input({ title: '生日', componentProps: { placeholder: 'YYYY-MM-DD' } }),
      city: f.Input({ title: '城市' }),
    },
    {
      title: '更多信息',
      component: 'EditablePopover',
    }
  ),
})

export default () => {
  const [form] = useState(() =>
    createForm({
      pattern: 'editable',
      values: { name: 'Alice', email: 'alice@example.com', profile: { birthday: '1995-06-01', city: '杭州' } },
    })
  )

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div style={{ color: '#666' }}>点击字段进入编辑态，失焦后恢复为阅读态。</div>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
    </div>
  )
}
