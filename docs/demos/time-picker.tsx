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
  basic: f.TimePicker({ title: '时间' }),
  format: f.TimePicker({ title: '自定义格式', componentProps: { format: 'HH:mm' } }),
  step: f.TimePicker({ title: '步长 15 分钟', componentProps: { minuteStep: 15 } }),
  range: f.TimeRangePicker({ title: '时间范围' }),
})

const createInitialValues = () => ({
  basic: '10:30:00',
  format: '10:30',
  step: '10:45:00',
  range: ['09:00:00', '18:00:00'],
})

export default () => {
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
