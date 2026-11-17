import { createForm, createSchema } from '@formvk/react'
import type { ReactElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Form } from '../index'
import { f, SchemaField } from './helpers'

const render = (node: ReactElement) => renderToStaticMarkup(node)

const countInputs = (html: string) => (html.match(/<input /g) || []).length

describe('ArrayItems', () => {
  it('对象数组 push/remove 与原始数组 push 后正确渲染', async () => {
    const form = createForm({
      values: {
        users: [{ name: 'a' }],
        tags: ['x'],
      },
    })
    const schema = createSchema({
      users: f.ArrayItems(f.Object({ name: f.Input({ title: '姓名' }) })),
      tags: f.ArrayItems(f.Input()),
    })

    const renderForm = () =>
      render(
        <Form form={form}>
          <SchemaField schema={schema} />
        </Form>
      )

    let html = renderForm()
    expect(countInputs(html)).toBe(2)

    const usersField = form.query('users').take() as any
    await usersField.push({ name: 'b' })
    html = renderForm()
    expect(countInputs(html)).toBe(3)
    expect(html).toContain('value="b"')

    await usersField.remove(0)
    html = renderForm()
    expect(countInputs(html)).toBe(2)
    expect(html).not.toContain('value="a"')
    expect(html).toContain('value="b"')

    const tagsField = form.query('tags').take() as any
    await tagsField.push('y')
    html = renderForm()
    expect(countInputs(html)).toBe(3)
    expect(html).toContain('value="y"')
  })
})
