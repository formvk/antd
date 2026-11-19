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
  group: f.CheckboxGroup({
    title: '多选组',
    enum: [
      { label: '阅读', value: 'read' },
      { label: '运动', value: 'sport' },
      { label: '音乐', value: 'music' },
    ],
  }),
  vertical: f.CheckboxGroup({
    title: '纵向排列',
    componentProps: {
      options: [
        { label: '苹果', value: 'apple' },
        { label: '香蕉', value: 'banana' },
      ],
      style: { display: 'grid', gap: 8 },
    },
  }),
  single: f.Checkbox({
    title: '单个 Checkbox（布尔值）',
    componentProps: { children: '订阅通知' },
  }),
})

const createInitialValues = () => ({
  group: ['read', 'music'],
  vertical: ['apple'],
  single: true,
})

const Demo = () => {
  const [form] = useState(() => createForm({ values: createInitialValues() }))
  const [readPrettyForm] = useState(() => createForm({ pattern: 'readPretty', values: createInitialValues() }))

  return (
    <OptionsProvider>
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
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
