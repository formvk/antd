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
  group: f.RadioGroup({
    title: '单选组',
    enum: [
      { label: '选项 A', value: 'a' },
      { label: '选项 B', value: 'b' },
      { label: '选项 C', value: 'c' },
    ],
  }),
  buttonGroup: f.RadioGroup({
    title: '按钮样式',
    componentProps: {
      optionType: 'button',
      buttonStyle: 'solid',
      options: [
        { label: '日', value: 'day' },
        { label: '周', value: 'week' },
        { label: '月', value: 'month' },
      ],
    },
  }),
  single: f.Radio({
    title: '单个 Radio（布尔值）',
    componentProps: { children: '同意协议' },
  }),
})

const createInitialValues = () => ({
  group: 'b',
  buttonGroup: 'week',
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
