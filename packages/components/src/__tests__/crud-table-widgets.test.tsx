import { TableModel } from '@formvk/models'
import { createSchema, createSchemaOptions } from '@formvk/react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

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
} from '../index'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

const render = (node: ReactElement) => renderToStaticMarkup(node)

interface IRecord {
  id: number
  name: string
}

const records: IRecord[] = [
  { id: 1, name: 'alice' },
  { id: 2, name: 'bob' },
]

const createTable = () =>
  new TableModel<IRecord>({
    state: { count: records.length },
    search: async () => records,
  })

describe('CrudTable widgets 自由组合', () => {
  it('TableModelProvider + SearchForm + DataTable + 弹窗可脱离 CrudTable 使用', async () => {
    const table = createTable()
    await table.onSearch()

    const searchSchema = createSchema({
      keyword: f.Input({ title: '关键字' }),
    })
    const formSchema = createSchema({
      name: f.Input({ title: '名称' }),
    })

    const html = render(
      <OptionsProvider>
        <TableModelProvider value={table}>
          <SearchForm schema={searchSchema} />
          <DataTable
            rowKey="id"
            columns={[{ title: '{{ "表达式标题" }}', dataIndex: 'name', render: renders.text() }]}
          />
          <AddPopup schema={formSchema} type="modal" title="新增" />
          <EditPopup schema={formSchema} type="modal" title="编辑" />
        </TableModelProvider>
      </OptionsProvider>
    )

    expect(html).toContain('ant-form-inline')
    expect(html).toContain('关键字')
    expect(html).toContain('alice')
    expect(html).toContain('bob')
    expect(html).toContain('表达式标题')
    expect(html).not.toContain('{{')
    expect(html).toContain('ant-pagination')
  })

  it('DataTable 支持 $state 表达式列并可按需关闭分页', async () => {
    const table = createTable()
    await table.onSearch()

    const html = render(
      <TableModelProvider value={table}>
        <DataTable rowKey="id" pagination={false} columns={[{ title: '{{ $state.count }}', dataIndex: 'name' }]} />
      </TableModelProvider>
    )

    expect(html).toContain('>2<')
    expect(html).not.toContain('ant-pagination')
  })
})
