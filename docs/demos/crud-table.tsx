import { CrudTable, arrayComponents, fieldComponents, renders, voidComponents } from '@formvk/antd'
import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/react'
import { Button, Popconfirm, Space } from 'antd'
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
      <div style={{ display: 'grid', gap: 12 }}>
        <Button type="primary" style={{ justifySelf: 'start' }} onClick={() => table.addPopup.open()}>
          新增
        </Button>
        <CrudTable
          table={table}
          title="用户"
          rowKey="id"
          search={searchSchema}
          add={formSchema}
          edit={formSchema}
          popupProps={{ type: 'modal', width: 480 }}
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
    </OptionsProvider>
  )
}

export default withDemoTheme(Demo)
