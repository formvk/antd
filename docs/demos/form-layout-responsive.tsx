import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { Segmented, Slider } from 'antd'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  username: f.Input({ title: '用户名' }),
  email: f.Input({ title: '邮箱' }),
  role: f.Select({
    title: '角色',
    enum: [
      { label: '管理员', value: 'admin' },
      { label: '访客', value: 'guest' },
    ],
  }),
  remark: f.Input({ title: '备注' }),
})

const Demo = () => {
  const [form] = useState(() => createForm())
  const [width, setWidth] = useState(520)
  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr')

  return (
    <OptionsProvider>
      <div style={{ width, maxWidth: '100%' }}>
        <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
          <label>
            容器宽度：{width}px
            <Slider min={320} max={860} value={width} onChange={setWidth} />
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            direction：
            <Segmented
              value={direction}
              onChange={value => setDirection(value as 'ltr' | 'rtl')}
              options={['ltr', 'rtl']}
            />
          </label>
        </div>
        {/* 数组按 breakpoints 生效：宽屏 inline/左对齐，窄屏 vertical/右对齐 */}
        <Form
          form={form}
          direction={direction}
          layout={['vertical', 'horizontal', 'inline']}
          labelAlign={['left', 'right', 'right']}
          labelCol={[24, 6, 6]}
          wrapperCol={[24, 12, 12]}
          breakpoints={[480, 720]}
          spaceGap={12}
          gridColumnGap={16}
          gridRowGap={8}
        >
          <SchemaField schema={schema} />
        </Form>
      </div>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
