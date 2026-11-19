import type { TableModel } from '@formvk/models'
import { Fragment } from 'react'
import type { ReactNode } from 'react'

import { EllipsisText } from '../../components/ellipsis-text'
import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { ITree, RenderProps } from './types'
import { findOption, renderPlaceholder } from './utils'

export interface OptionRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: ReactNode
  /** 内容溢出时单行省略 */
  ellipsis?: boolean
  /** 选项数据源，支持树形结构与函数形式 */
  options: ITree[] | ((props: RenderProps<Model, Scope, any, Record>) => ITree[])
  /** 树形选项只显示最后一级，默认 `true` */
  last?: boolean
  /** 多级选项的分隔符，默认 `/` */
  separator?: string
}

/** 枚举渲染：把值（或值数组）渲染为选项文本 */
export function option<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(config: OptionRenderOptions<Model, Scope, Record> | OptionRenderOptions<Model, Scope, Record>['options']) {
  const options = Array.isArray(config) || typeof config === 'function' ? { options: config } : config
  const { last = true, separator = '/', ellipsis } = options

  return createRender<Model, Scope, any, Record>(props => {
    const placeholder = useTablePlaceholder(options.placeholder)
    const dataSource = typeof options.options === 'function' ? options.options(props) : options.options

    const renderContent = (value: unknown) => {
      const chain = findOption(dataSource, value)
      if (!chain.length) {
        return renderPlaceholder(value, placeholder)
      }
      if (last) {
        return renderPlaceholder(chain[chain.length - 1]?.label, placeholder)
      }
      return chain.map(item => item.label).join(separator)
    }

    if (Array.isArray(props.text)) {
      if (!props.text.length) {
        return <>{placeholder}</>
      }
      const content = props.text.flatMap((value, index) => [
        ...(index ? [separator] : []),
        <Fragment key={String(value)}>{renderContent(value)}</Fragment>,
      ])
      return ellipsis ? <EllipsisText>{content}</EllipsisText> : <>{content}</>
    }

    const content = renderContent(props.text)
    return ellipsis ? <EllipsisText>{content}</EllipsisText> : <>{content}</>
  })
}
