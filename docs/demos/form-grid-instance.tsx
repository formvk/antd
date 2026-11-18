import { Form, FormGrid, FormItem, Input, createFormGrid } from '@formvk/antd'
import { createForm, createSchema, createSchemaField, observer } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Input },
  voidComponents: { FormItem, FormGrid },
  defaultDecorator: 'FormItem',
})

// 实例在模块作用域创建，schema 保持静态
const grid = createFormGrid({
  minWidth: 180,
  maxColumns: 3,
  // 返回 false 的节点会被自动隐藏并跳过占位
  shouldVisible: node => (node.index ?? 0) < 7,
  // 示例通过控制台输出演示布局回调
  // oxlint-disable-next-line no-console
  onInitialized: instance => console.info('onInitialized', instance.columns),
  // oxlint-disable-next-line no-console
  onDigest: instance => console.info('onDigest', instance.columns, instance.rows),
})

const schema = createSchema({
  grid: f.FormGrid({
    // Grid 类型包含大量响应式泛型，这里收窄 componentProps 以避免类型实例化过深
    componentProps: { grid } as any,
    properties: {
      name: f.Input({ title: '姓名' }),
      email: f.Input({ title: '邮箱' }),
      mobile: f.Input({ title: '手机号' }),
      company: f.Input({ title: '公司' }),
      city: f.Input({ title: '城市' }),
      address: f.Input({ title: '地址' }),
      remark: f.Input({ title: '备注（跨两列）', decoratorProps: { gridSpan: 2 } }),
      hidden: f.Input({ title: '这一项会被 shouldVisible 隐藏' }),
    },
  }),
})

// grid 实例是响应式的，直接读取布局结果即可
const GridDigest = observer(() => (
  <div style={{ marginBottom: 8, color: '#666' }}>
    {grid.ready ? `列数：${grid.columns}，行数：${grid.rows}` : '等待布局完成'}
  </div>
))

export default () => {
  const [form] = useState(() => createForm())

  return (
    <Form form={form} layout="vertical">
      <GridDigest />
      <SchemaField schema={schema} />
    </Form>
  )
}
