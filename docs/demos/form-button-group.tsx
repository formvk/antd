import { Form, FormButtonGroup, Reset, Submit, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { Segmented } from 'antd'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  email: f.Input({ title: '邮箱' }),
})

export default () => {
  const [form] = useState(() => createForm())
  const [align, setAlign] = useState<'left' | 'center' | 'right'>('left')

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 24 }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          align：
          <Segmented
            value={align}
            onChange={value => setAlign(value as typeof align)}
            options={['left', 'center', 'right']}
          />
        </label>

        <Form form={form}>
          <SchemaField schema={schema} />
          {/* gutter 控制按钮间距 */}
          <FormButtonGroup align={align} gutter={16}>
            <Submit>提交</Submit>
            <Reset>重置</Reset>
          </FormButtonGroup>
          {/* FormItem 内部自带 Space，适合放置多个操作项 */}
          <FormButtonGroup.FormItem gutter={12}>
            <Submit>保存</Submit>
            <Reset>取消</Reset>
          </FormButtonGroup.FormItem>
        </Form>

        <div>
          <div style={{ marginBottom: 8 }}>FormButtonGroup.Sticky：滚动时吸附在底部</div>
          <div
            style={{
              height: 180,
              overflow: 'auto',
              border: '1px solid #d9d9d9',
              borderRadius: 8,
              padding: 12,
            }}
          >
            <div style={{ height: 400 }}>
              <Form form={form}>
                <SchemaField schema={schema} />
                <FormButtonGroup.Sticky align="right">
                  <Submit>提交</Submit>
                  <Reset>重置</Reset>
                </FormButtonGroup.Sticky>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </OptionsProvider>
  )
}
