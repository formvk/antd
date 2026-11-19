import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const treeData = [
  {
    title: '研发部',
    value: 'dev',
    children: [
      { title: '前端组', value: 'fe' },
      { title: '后端组', value: 'be' },
    ],
  },
  {
    title: '设计部',
    value: 'design',
    children: [{ title: '交互组', value: 'ux' }],
  },
]

const schema = createSchema({
  basic: f.TreeSelect({ title: '树选择', componentProps: { treeData, treeDefaultExpandAll: true } }),
  multiple: f.TreeSelect({
    title: '多选',
    componentProps: { treeData, multiple: true, treeDefaultExpandAll: true },
  }),
  checkable: f.TreeSelect({
    title: '可勾选',
    componentProps: { treeData, treeCheckable: true, showCheckedStrategy: 'SHOW_ALL' },
  }),
  search: f.TreeSelect({
    title: '可搜索',
    componentProps: { treeData, showSearch: true, treeNodeFilterProp: 'title' },
  }),
})

const createInitialValues = () => ({
  basic: 'fe',
  multiple: ['fe', 'ux'],
  checkable: ['dev'],
  search: 'be',
})

export default () => {
  const [form] = useState(() => createForm({ values: createInitialValues() }))
  const [readPrettyForm] = useState(() => createForm({ pattern: 'readPretty', values: createInitialValues() }))

  return (
    <OptionsProvider>
      <div style={{ display: 'grid', gap: 16 }}>
        <Form form={form} layout="vertical">
          <SchemaField schema={schema} />
        </Form>
        <div>
          <div style={{ marginBottom: 12, fontWeight: 600 }}>阅读态（readPretty）</div>
          <Form form={readPrettyForm} layout="vertical" previewTextPlaceholder="—">
            <SchemaField schema={schema} />
          </Form>
        </div>
      </div>
    </OptionsProvider>
  )
}
