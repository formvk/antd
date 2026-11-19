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
  date: f.DatePicker({ title: '日期', componentProps: { style: { width: '100%' } } }),
  month: f.DatePicker({ title: '月份', componentProps: { picker: 'month' } }),
  year: f.DatePicker({ title: '年份', componentProps: { picker: 'year' } }),
  datetime: f.DatePicker({ title: '日期时间', componentProps: { showTime: true } }),
  format: f.DatePicker({ title: '自定义格式', componentProps: { format: 'DD/MM/YYYY' } }),
  range: f.DateRangePicker({ title: '日期范围' }),
})

const createInitialValues = () => ({
  date: '2026-11-17',
  month: '2026-11',
  year: '2026',
  datetime: '2026-11-17 10:30:00',
  format: '17/11/2026',
  range: ['2026-11-01', '2026-11-17'],
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
