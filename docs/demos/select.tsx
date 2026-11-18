import { Form, FormItem, Select } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Select },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const schema = createSchema({
  single: f.Select({
    title: '单选',
    enum: [
      { label: '选项一', value: 'a' },
      { label: '选项二', value: 'b' },
    ],
    componentProps: { allowClear: true, placeholder: '请选择' },
  }),
  multiple: f.Select({
    title: '多选',
    componentProps: {
      mode: 'multiple',
      allowClear: true,
      options: [
        { label: 'React', value: 'react' },
        { label: 'Vue', value: 'vue' },
        { label: 'Angular', value: 'angular' },
      ],
    },
  }),
  search: f.Select({
    title: '可搜索',
    componentProps: {
      showSearch: true,
      options: [
        { label: '杭州', value: 'hangzhou' },
        { label: '上海', value: 'shanghai' },
        { label: '北京', value: 'beijing' },
      ],
    },
  }),
  options: f.Select({
    title: '使用 componentProps.options',
    componentProps: {
      options: [
        { label: '管理员', value: 'admin' },
        { label: '访客', value: 'guest' },
      ],
    },
  }),
})

const createInitialValues = () => ({
  single: 'a',
  multiple: ['react', 'vue'],
  search: 'hangzhou',
  options: 'guest',
})

export default () => {
  const [form] = useState(() => createForm({ values: createInitialValues() }))
  const [readPrettyForm] = useState(() => createForm({ pattern: 'readPretty', values: createInitialValues() }))

  return (
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
  )
}
