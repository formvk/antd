import { PopupForm, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { PopupModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/react'
import { Button, Segmented, Space } from 'antd'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  email: f.Input({ title: '邮箱', required: true }),
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export default () => {
  const [type, setType] = useState<'modal' | 'drawer'>('modal')
  const [result, setResult] = useState('')
  const [popup] = useState(
    () =>
      new PopupModel(async (values: Record<string, unknown>) => {
        await delay(400)
        setResult(`保存成功：${JSON.stringify(values)}`)
        return true
      })
  )

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        <Space>
          <Segmented
            value={type}
            onChange={value => setType(value as 'modal' | 'drawer')}
            options={[
              { label: 'Modal', value: 'modal' },
              { label: 'Drawer', value: 'drawer' },
            ]}
          />
          <Button type="primary" onClick={() => popup.open()}>
            新增用户
          </Button>
        </Space>
        {type === 'modal' ? (
          <PopupForm type="modal" popup={popup} title="新增用户" schema={schema} />
        ) : (
          <PopupForm type="drawer" popup={popup} title="新增用户" schema={schema} />
        )}
        {result ? <div style={{ color: 'var(--vp-c-green-1, #389e0d)' }}>{result}</div> : null}
      </div>
    </OptionsProvider>
  )
}
