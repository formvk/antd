import { Form, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
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
  username: f.Input({ title: '用户名', required: true }),
})

const Demo = () => {
  const [form] = useState(() => createForm())
  const [log, setLog] = useState('')

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
          <Submit
            onSubmit={values => setLog(`onSubmit：${JSON.stringify(values)}`)}
            onSubmitSuccess={values => setLog(`onSubmitSuccess：${JSON.stringify(values)}`)}
            onSubmitFailed={feedbacks => setLog(`onSubmitFailed：${feedbacks.length} 条错误`)}
          >
            提交
          </Submit>
        </Form>
        {log && <div>{log}</div>}
      </div>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
