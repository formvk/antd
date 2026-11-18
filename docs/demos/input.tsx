import { Form, FormItem, Input, TextArea } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, TextArea },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  normal: f.Input({ title: '基础输入' }),
  prefix: f.Input({
    title: '前后缀',
    componentProps: { prefix: '¥', suffix: 'RMB', allowClear: true },
  }),
  maxLength: f.Input({
    title: '字数限制',
    componentProps: { maxLength: 10, showCount: true, placeholder: '最多 10 个字符' },
  }),
  disabled: f.Input({ title: '禁用', componentProps: { disabled: true } }),
  textarea: f.TextArea({
    title: '多行文本',
    componentProps: { rows: 3, showCount: true, maxLength: 100 },
  }),
})

const createInitialValues = () => ({
  normal: 'hello',
  prefix: '1999',
  maxLength: 'formvk',
  disabled: '禁用态固定内容',
  textarea: '这是一段多行文本，阅读态会渲染为纯文本。',
})

export default () => {
  const [form] = useState(() => createForm({ values: createInitialValues() }))
  const [readPrettyForm] = useState(() => createForm({ pattern: 'readPretty', values: createInitialValues() }))

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
      </Form>
      <div>
        <div style={{ marginBottom: 12, fontWeight: 600 }}>阅读态（readPretty）</div>
        <Form form={readPrettyForm} layout="vertical" previewTextPlaceholder="—">
          <SchemaField schema={schema} />
        </Form>
      </div>
    </div>
  )
}
