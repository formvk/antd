import { Form, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
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
  email: f.Input({ title: '邮箱' }),
})

const Demo = () => {
  const [form] = useState(() =>
    createForm({
      values: { username: 'alice', email: '' },
    })
  )
  const [result, setResult] = useState('')
  const [validate, setValidate] = useState(false)

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Submit>保存</Submit>
            {/* forceClear 清除值，validate 在重置后触发校验 */}
            <Reset
              forceClear
              validate={validate}
              onResetValidateSuccess={() => setResult('重置并校验成功')}
              onResetValidateFailed={() => setResult('重置后校验失败')}
            >
              重置
            </Reset>
            <label style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <input type="checkbox" checked={validate} onChange={event => setValidate(event.target.checked)} />
              validate
            </label>
          </div>
        </Form>
        {result && <div>{result}</div>}
      </div>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
