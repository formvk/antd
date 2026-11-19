import type { TableModel } from '@formvk/models'
import type { TooltipProps } from 'antd'
import type { ReactNode } from 'react'

import { EllipsisText } from '../../components/ellipsis-text'
import { useTablePlaceholder } from '../../hooks'
import { createRender } from './createRender'
import type { RenderProps } from './types'

export interface TextRenderOptions<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
> {
  /** 空值占位符，默认继承 CrudTable 的 placeholder */
  placeholder?: ReactNode
  /** 内容溢出时单行省略，并通过 Tooltip 展示完整内容 */
  ellipsis?: boolean
  tooltipProps?: TooltipProps
  /** 自定义渲染 */
  format?: (props: RenderProps<Model, Scope, string, Record>) => ReactNode
}

/** 纯文本渲染，支持占位符、省略与自定义格式化 */
export function text<
  Model extends TableModel = TableModel,
  Scope extends object = any,
  Record extends object = Model['records'][number],
>(options: TextRenderOptions<Model, Scope, Record> | TextRenderOptions<Model, Scope, Record>['format'] = {}) {
  const config = typeof options === 'function' ? { format: options } : options
  const { ellipsis, format, tooltipProps } = config

  return createRender<Model, Scope, string, Record>(props => {
    const placeholder = useTablePlaceholder(config.placeholder)
    const content = format ? (format(props) ?? placeholder) : props.text || placeholder

    return ellipsis ? <EllipsisText tooltipProps={tooltipProps}>{content}</EllipsisText> : <>{content}</>
  })
}
