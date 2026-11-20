import {
  AddPopup,
  DataTable,
  EditPopup,
  SearchForm,
  TableModelProvider,
  arrayComponents,
  fieldComponents,
  renders,
  voidComponents,
} from '@formvk/antd'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/react'
import { Button, Card, Popconfirm, Space } from 'antd'
import { useState } from 'react'

import { withDemoTheme } from './DemoTheme'

interface IUser {
  id: number
  username: string
  email: string
}

let seed = 3
let users: IUser[] = [
  { id: 1, username: 'alice', email: 'alice@example.com' },
  { id: 2, username: 'bob', email: 'bob@example.com' },
]

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const searchSchema = createSchema({
  username: f.Input({ title: '用户名' }),
})

const formSchema = createSchema({
  username: f.Input({ title: '用户名', required: true }),
  email: f.Input({ title: '邮箱', required: true }),
})

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

const Demo = () => {
  const [table] = useState(
    () =>
      new TableModel<IUser>({
        search: async (values, pagination) => {
          await delay(300)
          const keyword = (values.username ?? '').trim()
          const filtered = users.filter(user => user.username.includes(keyword))
          const start = (pagination.current - 1) * pagination.pageSize
          return {
            records: filtered.slice(start, start + pagination.pageSize),
            pagination: { ...pagination, total: filtered.length },
          }
        },
        add: async values => {
          await delay(300)
          users = [{ id: seed++, username: values.username ?? '', email: values.email ?? '' }, ...users]
          return true
        },
        edit: async values => {
          await delay(300)
          users = users.map(user => (user.id === values.id ? { ...user, ...values } : user))
          return true
        },
        remove: async record => {
          await delay(300)
          users = users.filter(user => user.id !== record.id)
          return true
        },
      })
  )

  return (
    <OptionsProvider>
      {/* 一个 Provider 即可让下列组件共享同一个表格模型 */}
      <TableModelProvider value={table}>
        <Card
          title="用户列表"
          extra={
            <Button type="primary" onClick={() => table.addPopup.open()}>
              新增
            </Button>
          }
        >
          <div style={{ display: 'grid', gap: 12 }}>
            {/* 搜索表单可放到任意位置，提交后自动刷新表格 */}
            <SearchForm schema={searchSchema} />
            <DataTable
              rowKey="id"
              columns={[
                { title: '序号', width: 70, render: renders.serial() },
                { title: '用户名', dataIndex: 'username', render: renders.text() },
                { title: '邮箱', dataIndex: 'email', render: renders.text({ ellipsis: true }) },
                {
                  title: '操作',
                  key: 'actions',
                  render: (_: unknown, record: IUser) => (
                    <Space>
                      <Button type="link" onClick={() => table.editPopup.open(record)}>
                        编辑
                      </Button>
                      <Popconfirm title={`确认删除「${record.username}」？`} onConfirm={() => table.onRemove(record)}>
                        <Button type="link" danger>
                          删除
                        </Button>
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          </div>
        </Card>
        <AddPopup type="modal" title="新增用户" width={480} schema={formSchema} />
        <EditPopup type="modal" title="编辑用户" width={480} schema={formSchema} />
      </TableModelProvider>
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
