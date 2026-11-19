import { TableModel } from '@formvk/models'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { TableRenderProvider, renders } from '../index'

const render = (node: ReactElement) => renderToStaticMarkup(node)

interface IRecord {
  id: number
  name?: string
  status?: number
  level?: number
  avatar?: string
  homepage?: string
  createdAt?: number | string
}

const records: IRecord[] = [
  {
    id: 1,
    name: 'alice',
    status: 1,
    level: 2,
    avatar: 'https://example.com/avatar.png',
    homepage: 'https://example.com',
    createdAt: new Date(2024, 0, 2, 3, 4, 5).getTime(),
  },
  { id: 2 },
]

const createTable = () =>
  new TableModel<IRecord>({
    state: { count: records.length },
    search: async () => records,
  })

const renderTable = (
  columns: ColumnsType<IRecord>,
  table = createTable(),
  placeholder?: string,
  scope?: Record<string, unknown>
) =>
  render(
    <TableRenderProvider value={{ table, placeholder, scope }}>
      <Table rowKey="id" pagination={false} dataSource={records} columns={columns} />
    </TableRenderProvider>
  )

describe('表格渲染器', () => {
  it('内置渲染器渲染文本、选项、标签、时间与序号', () => {
    const html = renderTable(
      [
        { title: '序号', render: renders.serial() },
        { title: '名称', dataIndex: 'name', render: renders.text() },
        {
          title: '状态',
          dataIndex: 'status',
          render: renders.option([
            { label: '启用', value: 1 },
            { label: '停用', value: 0 },
          ]),
        },
        {
          title: '级别',
          dataIndex: 'level',
          render: renders.tag([
            { label: '普通', value: 1, color: 'blue' },
            { label: '高级', value: 2, color: 'red' },
          ]),
        },
        { title: '创建时间', dataIndex: 'createdAt', render: renders.time() },
      ],
      createTable(),
      '暂无'
    )

    expect(html).toContain('alice')
    expect(html).toContain('启用')
    expect(html).toContain('高级')
    expect(html).toContain('2024-01-02 03:04:05')
    // 空值回退到 CrudTable 提供的 placeholder
    expect(html).toContain('暂无')
    // 序号从 1 开始
    expect(html).toContain('>1</td>')
    expect(html).toContain('>2</td>')
  })

  it('image 与 link 渲染器输出图片与链接', () => {
    const html = renderTable([
      { title: '头像', dataIndex: 'avatar', render: renders.image({ size: 32 }) },
      {
        title: '主页',
        dataIndex: 'homepage',
        render: renders.link({ format: ({ record }) => `/user/${record.id}` }),
      },
    ])

    expect(html).toContain('src="https://example.com/avatar.png"')
    expect(html).toContain('width:32px')
    expect(html).toContain('href="/user/1"')
    expect(html).toContain('target="_blank"')
  })

  it('createRender 可读取 table、$state 与自定义 scope', () => {
    const custom = renders.createRender<TableModel<IRecord>, { greeting: string }, IRecord['name']>(props => (
      <span>{`${props.greeting}-${props.text}-${props.$state.count}`}</span>
    ))

    const html = renderTable([{ title: '自定义', dataIndex: 'name', render: custom }], createTable(), '--', {
      greeting: 'hi',
    })

    expect(html).toContain('hi-alice-2')
  })

  it('缺少 TableRenderProvider 时抛出明确错误', () => {
    expect(() =>
      render(
        <Table
          rowKey="id"
          pagination={false}
          dataSource={records}
          columns={[{ title: '名称', dataIndex: 'name', render: renders.text() }]}
        />
      )
    ).toThrow('表格渲染器缺少上下文')
  })
})
