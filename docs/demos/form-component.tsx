import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, observer, SchemaField } from '@formvk/react'
import { Switch } from 'antd'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  name: f.Input({ title: '姓名' }),
  company: f.Input({ title: '公司' }),
})

export default observer(() => {
  const [form] = useState(() =>
    createForm({
      pattern: 'readPretty',
      values: { name: 'Alice', company: '' },
    })
  )

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 12 }}>
        {/* component 指定渲染容器；previewTextPlaceholder 控制阅读态空值占位符 */}
        <Form
          form={form}
          component="div"
          layout="vertical"
          previewTextPlaceholder="暂无数据"
          style={{ padding: 12, border: '1px solid #d9d9d9', borderRadius: 8 }}
        >
          <SchemaField schema={schema} />
        </Form>
        <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Switch
            checked={form.readPretty}
            onChange={checked => {
              form.readPretty = checked
            }}
          />
          切换阅读态
        </label>
      </div>
    </OptionsProvider>
  )
})
