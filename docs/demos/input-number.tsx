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
  basic: f.InputNumber({ title: '基础数字', componentProps: { min: 0, max: 100 } }),
  step: f.InputNumber({ title: '步长 5', componentProps: { step: 5 } }),
  precision: f.InputNumber({ title: '保留两位小数', componentProps: { precision: 2, step: 0.01 } }),
  formatter: f.InputNumber({
    title: '格式化',
    componentProps: {
      style: { width: 220 },
      formatter: value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ','),
      parser: value => Number(value!.replace(/\$\s?|(,*)/g, '')),
    },
  }),
})

const createInitialValues = () => ({
  basic: 10,
  step: 10,
  precision: 1.5,
  formatter: 12345,
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
