import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { FormConsumer, createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const dataSource = [
  { key: 1, name: 'Alice', age: 24 },
  { key: 2, name: 'Bob', age: 28 },
  { key: 3, name: 'Carol', age: 31 },
  { key: 4, name: 'Dave', age: 35 },
]

// schema 静态定义，dataSource 与过滤函数都放在模块作用域
const schema = createSchema({
  users: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '姓名' },
      }),
      age: f.Column({
        componentProps: { key: 'age', dataIndex: 'age', title: '年龄' },
      }),
    }),
    {
      title: '成员（多选）',
      componentProps: {
        dataSource,
        showSearch: true,
        searchProps: { placeholder: '搜索姓名' },
        // 自定义过滤：按姓名包含关键词
        filterOption: (option: any, keyword: string) => option.name.includes(keyword),
        // 按照年龄倒序
        filterSort: (a: any, b: any) => b.age - a.age,
        // 选中项以整行数据作为值
        optionAsValue: true,
      },
    }
  ),
  single: f.SelectTable(
    f.Object({
      name: f.Column({
        componentProps: { key: 'name', dataIndex: 'name', title: '姓名' },
      }),
    }),
    {
      title: '负责人（单选）',
      componentProps: {
        mode: 'single',
        dataSource,
        // valueType 控制输出值的形态：all / parent / child / path
        valueType: 'all',
      },
    }
  ),
})

export default () => {
  const [form] = useState(() => createForm({ values: { users: [1], single: 2 } }))

  return (
    <OptionsProvider>
      <Form form={form}>
        <SchemaField schema={schema} />
        <FormConsumer>
          {({ form: consumerForm }) => (
            <pre
              style={{
                margin: 0,
                padding: 12,
                background: 'var(--vp-c-bg-soft, #f6f8fa)',
                borderRadius: 8,
              }}
            >
              {JSON.stringify(consumerForm.values, null, 2)}
            </pre>
          )}
        </FormConsumer>
      </Form>
    </OptionsProvider>
  )
}
