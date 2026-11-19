import { Form, arrayComponents, createFormCollapse, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { Button } from 'antd'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

// 受控实例与 schema 均静态定义
const collapse = createFormCollapse(['base'])

const schema = createSchema({
  panels: f.FormCollapse({
    componentProps: {
      // 传入 createFormCollapse 实例即可受控
      formCollapse: collapse,
      accordion: true,
    },
    properties: {
      base: f.CollapsePanel({
        componentProps: { key: 'base', header: '基本信息' },
        properties: {
          name: f.Input({ title: '姓名' }),
          email: f.Input({ title: '邮箱' }),
        },
      }),
      contact: f.CollapsePanel({
        componentProps: { key: 'contact', header: '联系方式' },
        properties: {
          mobile: f.Input({ title: '手机号' }),
          address: f.Input({ title: '地址' }),
        },
      }),
    },
  }),
})

const Demo = () => {
  const [form] = useState(() => createForm())

  return (
    <OptionsProvider>
      <Form form={form} layout="vertical">
        <SchemaField schema={schema} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button onClick={() => collapse.toggleActiveKey('base')}>切换基本信息</Button>
          <Button onClick={() => collapse.setActiveKeys(['contact'])}>切换到联系方式</Button>
        </div>
      </Form>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
