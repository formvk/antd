import type { TableModel } from '@formvk/models'
import { Space, Tag } from 'antd'
import type { TagProps } from 'antd'
import type { ReactNode } from 'react'

import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { ITree, RenderProps } from './types'
import { findOption, renderPlaceholder } from './utils'

export interface TagRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: ReactNode
  /** 选项数据源，数组项可携带 `color` 等 Tag 属性 */
  options:
    | ITree<Omit<TagProps, 'children'>>[]
    | ((props: RenderProps<Model, Scope, any, Record>) => ITree<Omit<TagProps, 'children'>>[])
  /** 树形选项只显示最后一级，默认 `true` */
  last?: boolean
}

/** 枚举标签渲染：把值渲染为 Tag */
export function tag<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(_config: TagRenderOptions<Model, Scope, Record> | TagRenderOptions<Model, Scope, Record>['options']) {
  const config = Array.isArray(_config) || typeof _config === 'function' ? { options: _config } : _config
  const { last = true } = config

  return createRender<Model, Scope, any, Record>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    const dataSource = typeof config.options === 'function' ? config.options(props) : config.options
    const chain = findOption(dataSource, props.text)

    if (!chain.length) {
      return <>{renderPlaceholder(props.text, placeholder)}</>
    }

    if (last) {
      const { label, value: _value, children: _children, ...rest } = chain[chain.length - 1]
      return <Tag {...rest}>{renderPlaceholder(label, placeholder)}</Tag>
    }

    return (
      <Space>
        {chain.map((item, index) => {
          const { label, value, children: _children, ...rest } = item
          return (
            <Tag {...rest} key={String(value ?? index)}>
              {label}
            </Tag>
          )
        })}
      </Space>
    )
  })
}
