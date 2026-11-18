import { Form, FormItem, Input, Reset, Submit } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  email: f.Input({ title: '邮箱' }),
})

export default () => {
  const [form] = useState(() =>
    createForm({
      values: { username: 'alice', email: '' },
    })
  )
  const [result, setResult] = useState('')
  const [validate, setValidate] = useState(false)

  return (
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
  )
}
