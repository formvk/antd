import { Cascader, Form, FormItem } from '@formvk/antd'
import { createForm, createSchema, createSchemaField } from '@formvk/react'
import { useState } from 'react'

const { SchemaField, fragment: f } = createSchemaField({
  components: { Cascader },
  voidComponents: { FormItem },
  defaultDecorator: 'FormItem',
})

const options = [
  {
    label: '浙江',
    value: 'zhejiang',
    children: [
      { label: '杭州', value: 'hangzhou', children: [{ label: '西湖', value: 'xihu' }] },
      { label: '宁波', value: 'ningbo', children: [{ label: '鄞州', value: 'yinzhou' }] },
    ],
  },
  {
    label: '江苏',
    value: 'jiangsu',
    children: [{ label: '南京', value: 'nanjing', children: [{ label: '玄武', value: 'xuanwu' }] }],
  },
]

const schema = createSchema({
  basic: f.Cascader({ title: '级联选择', componentProps: { options } }),
  changeOnSelect: f.Cascader({
    title: '选择任意一级',
    componentProps: { options, changeOnSelect: true },
  }),
  multiple: f.Cascader({
    title: '多选',
    componentProps: { options, multiple: true, maxTagCount: 'responsive' },
  }),
})

const createInitialValues = () => ({
  basic: ['zhejiang', 'hangzhou', 'xihu'],
  changeOnSelect: ['zhejiang', 'hangzhou'],
  multiple: [['jiangsu', 'nanjing', 'xuanwu']],
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
