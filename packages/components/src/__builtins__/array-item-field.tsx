import { RecursionField } from '@formvk/react'
import type { ISchemaFilter, ISchemaMapper } from '@formvk/react'
import type { Schema } from '@formvk/schema'
import type { FC } from 'react'

export interface IArrayItemFieldProps {
  schema: Schema
  /** 数组项下标，作为 RecursionField 的 name */
  index: number
  filterProperties?: ISchemaFilter
  mapProperties?: ISchemaMapper
}

/**
 * formvk RecursionField 兼容层（对象数组 basePath 缺陷）。
 *
 * formily 官方 RecursionField 渲染 ObjectField 子属性时，以新字段自身 address
 * （含数组下标，如 users.0）作为子级 basePath；formvk 1.0.0 的 RecursionField
 * 会把入参 basePath（users）直接透传给子级，导致叶子字段错误建在 users.name。
 *
 * 两阶段渲染（仅 object/void 项需要）：
 * 1. onlyRenderSelf：在正确地址创建对象项字段（users.0），不渲染子属性；
 * 2. onlyRenderProperties：该分支会用 parent.address.concat(index) 得到
 *    users.0 作为 basePath，子属性路径恢复正确。
 *
 * 原始类型数组项（string/number 等）无子属性，不受缺陷影响，走原始渲染。
 */
export const ArrayItemField: FC<IArrayItemFieldProps> = ({ schema, index, filterProperties, mapProperties }) => {
  if (schema?.type !== 'object' && schema?.type !== 'void') {
    return (
      <RecursionField schema={schema} name={index} filterProperties={filterProperties} mapProperties={mapProperties} />
    )
  }
  return (
    <>
      <RecursionField schema={schema} name={index} onlyRenderSelf />
      <RecursionField
        schema={schema}
        name={index}
        onlyRenderProperties
        filterProperties={filterProperties}
        mapProperties={mapProperties}
      />
    </>
  )
}
