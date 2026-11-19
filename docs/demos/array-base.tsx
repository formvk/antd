import { ArrayItems, Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import type { IArrayBaseProps } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import type { FC, PropsWithChildren } from 'react'

import { withDemoTheme } from './DemoTheme'

// ArrayItems 的公开类型未包含 IArrayBaseProps，这里收窄为带数组属性的组件类型
const ArrayItemsField = ArrayItems as unknown as FC<PropsWithChildren<IArrayBaseProps>>

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents: { ...arrayComponents, ArrayItems: ArrayItemsField },
  defaultDecorator: 'FormItem',
})

const form = createForm({
  values: {
    lastAction: '',
    users: [{ name: 'Alice' }, { name: 'Bob' }],
    archived: [{ name: 'Carol' }],
  },
})

// onAdd / onCopy / onRemove / onMoveUp / onMoveDown 均来自 ArrayBase 的 IArrayBaseProps
const record = (action: string, index: number) => {
  form.setValuesIn('lastAction', `${action}: ${index}`)
}

// schema 保持静态，回调与禁用状态都通过静态 componentProps 表达
const schema = createSchema({
  lastAction: f.Input({
    title: '最近一次操作',
    componentProps: { disabled: true, placeholder: '操作下方数组后显示回调参数' },
  }),
  users: f.ArrayItems(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名', required: true }),
      sort: f.SortHandle(),
      copy: f.Copy({ title: '复制' }),
      remove: f.Remove({ title: '删除' }),
      up: f.MoveUp({ title: '上移' }),
      down: f.MoveDown({ title: '下移' }),
    }),
    {
      componentProps: {
        onAdd: (index: number) => record('onAdd', index),
        onCopy: (index: number) => record('onCopy', index),
        onRemove: (index: number) => record('onRemove', index),
        onMoveUp: (index: number) => record('onMoveUp', index),
        onMoveDown: (index: number) => record('onMoveDown', index),
      },
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
  archived: f.ArrayItems(
    f.Object({
      index: f.Index(),
      name: f.Input({ title: '姓名' }),
      remove: f.Remove({ title: '删除' }),
    }),
    {
      title: '已归档（disabled）',
      componentProps: { disabled: true },
      properties: {
        add: f.Addition({ title: '新增成员' }),
      },
    }
  ),
})

const Demo = () => (
  <OptionsProvider>
    <Form form={form}>
      <SchemaField schema={schema} />
    </Form>
  </OptionsProvider>
)

export default withDemoTheme(Demo)
