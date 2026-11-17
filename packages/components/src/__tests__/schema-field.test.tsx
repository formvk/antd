import { createForm, createSchema } from '@formvk/react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Form } from '../index'
import { f, SchemaField } from './helpers'

const render = (node: ReactElement) => renderToStaticMarkup(node)

describe('SchemaField 基础渲染', () => {
  it('渲染 Input / Select，回填初始值并渲染 FormItem 标题', () => {
    const form = createForm({ values: { name: 'alice', role: 'admin' } })
    const schema = createSchema({
      name: f.Input({ title: '姓名' }),
      role: f.Select({
        title: '角色',
        componentProps: {
          options: [
            { label: '管理员', value: 'admin' },
            { label: '访客', value: 'guest' },
          ],
        },
      }),
    })

    const html = render(
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    )

    expect(html).toContain('value="alice"')
    expect(html).toContain('ant-select')
    expect(html).toContain('姓名')
    expect(html).not.toContain('slots=')
  })

  it('readPretty 通过 PreviewText 渲染纯文本，不渲染 input', () => {
    const form = createForm({ values: { name: 'bob' }, readPretty: true })
    const schema = createSchema({
      name: f.Input({ title: '名称' }),
    })

    const html = render(
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    )

    expect(html).toContain('bob')
    expect(html).not.toContain('<input ')
  })

  it('容器组件通过 f 构造（FormGrid / TabPane / CollapsePanel）', () => {
    const form = createForm()
    const schema = createSchema({
      grid: f.FormGrid({
        properties: {
          g: f.Input({ title: 'G' }),
        },
      }),
      tabs: f.FormTab({
        properties: {
          pane: f.TabPane({
            properties: {
              t: f.Input({ title: 'T' }),
            },
          }),
        },
      }),
      collapse: f.FormCollapse({
        properties: {
          panel: f.CollapsePanel({
            properties: {
              c: f.Input({ title: 'C' }),
            },
          }),
        },
      }),
    })

    const html = render(
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    )

    expect(html).toContain('formvk-grid')
    expect(html).toContain('ant-tabs')
    expect(html).toContain('ant-collapse')
  })
})

describe('SchemaField 自定义组件引用', () => {
  it('函数组件 / memo 组件可渲染并接收字段值', () => {
    const form = createForm({ values: { c: 'hi' } })
    const CustomInput = (props: { value?: string }) => (
      <input className="custom-input" value={props.value ?? ''} readOnly />
    )
    const MemoBlock = () => <span className="memo-block" />
    const schema = createSchema({
      c: f.Field({ component: CustomInput }),
      m: f.Void({}, { component: MemoBlock }),
    })

    const html = render(
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    )

    expect(html).toContain('custom-input')
    expect(html).toContain('value="hi"')
    expect(html).toContain('memo-block')
  })
})

describe('SelectTable', () => {
  it('表格与列均通过 f 构造可正常渲染', () => {
    const form = createForm({ values: { rows: [1] } })
    const schema = createSchema({
      rows: f.SelectTable(
        f.Object({
          name: f.Column({
            componentProps: { key: 'name', dataIndex: 'name', title: '名称' },
          }),
        }),
        {
          componentProps: {
            dataSource: [
              { key: 1, name: 'A' },
              { key: 2, name: 'B' },
            ],
          },
        }
      ),
    })

    const html = render(
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    )

    expect(html).toContain('ant-table')
    expect(html).toContain('名称')
  })
})
