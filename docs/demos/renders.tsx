import { CrudTable, arrayComponents, fieldComponents, renders, voidComponents } from '@formvk/antd'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/react'
import { Button, Popconfirm, Space } from 'antd'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

interface ITask {
  id: number
  name: string
  status: number
  level: number
  avatar: string
  homepage: string
  createdAt: number
}

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const editSchema = createSchema({
  name: f.Input({ title: '任务名称', required: true }),
})

const statusOptions = [
  { label: '进行中', value: 1 },
  { label: '已完成', value: 0 },
]

const levelOptions = [
  { label: '普通', value: 1, color: 'blue' },
  { label: '重要', value: 2, color: 'orange' },
  { label: '紧急', value: 3, color: 'red' },
]

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

let tasks: ITask[] = [
  {
    id: 1,
    name: '接入内置渲染器',
    status: 1,
    level: 3,
    avatar: 'https://picsum.photos/seed/formvk-1/64/64',
    homepage: 'https://ant.design/components/table-cn',
    createdAt: new Date(2026, 0, 8, 10, 30, 0).getTime(),
  },
  {
    id: 2,
    name: '补充 CrudTable 弹窗配置',
    status: 0,
    level: 2,
    avatar: 'https://picsum.photos/seed/formvk-2/64/64',
    homepage: 'https://ant.design/components/modal-cn',
    createdAt: new Date(2026, 1, 18, 16, 45, 0).getTime(),
  },
  {
    id: 3,
    name: '校验空值占位符',
    status: 1,
    level: 1,
    avatar: '',
    homepage: '',
    createdAt: new Date(2026, 2, 1, 9, 0, 0).getTime(),
  },
]

const Demo = () => {
  const [table] = useState(
    () =>
      new TableModel<ITask>({
        search: async () => tasks,
        edit: async values => {
          await delay(200)
          tasks = tasks.map(task => (task.id === values.id ? { ...task, ...values } : task))
          return true
        },
        remove: async record => {
          await delay(200)
          tasks = tasks.filter(task => task.id !== record.id)
          return true
        },
      })
  )

  return (
    <OptionsProvider>
      <CrudTable
        table={table}
        rowKey="id"
        title="任务"
        edit={editSchema}
        popupProps={{ type: 'modal', width: 480 }}
        columns={[
          { title: '序号', width: 70, render: renders.serial() },
          { title: '任务名称', dataIndex: 'name', render: renders.text({ ellipsis: true }) },
          { title: '状态', dataIndex: 'status', render: renders.option(statusOptions) },
          { title: '优先级', dataIndex: 'level', render: renders.tag(levelOptions) },
          {
            title: '封面',
            dataIndex: 'avatar',
            render: renders.image({ size: 32, style: { borderRadius: 4 } }),
          },
          { title: '链接', dataIndex: 'homepage', render: renders.link() },
          { title: '创建时间', dataIndex: 'createdAt', render: renders.time() },
          {
            title: '操作',
            key: 'actions',
            render: (_: unknown, record: ITask) => (
              <Space>
                <Button type="link" onClick={() => table.editPopup.open(record)}>
                  编辑
                </Button>
                <Popconfirm title={`确认删除「${record.name}」？`} onConfirm={() => table.onRemove(record)}>
                  <Button type="link" danger>
                    删除
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
