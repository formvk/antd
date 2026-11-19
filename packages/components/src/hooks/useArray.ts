import type { ArrayField } from '@formvk/core'
import type { Schema } from '@formvk/react'
import { createContext, useContext } from 'react'

import type { IArrayBaseItemProps, IArrayBaseProps } from '../components/array-base'

export interface IArrayBaseContext {
  props: IArrayBaseProps
  field: ArrayField
  schema: Schema
}

export const ArrayBaseContext = createContext<IArrayBaseContext | null>(null)

export const ItemContext = createContext<IArrayBaseItemProps | null>(null)

const takeRecord = (val: any, index?: number) => (typeof val === 'function' ? val(index) : val)

export const useArray = () => {
  return useContext(ArrayBaseContext)
}

export const useIndex = (index?: number) => {
  const ctx = useContext(ItemContext)
  return (ctx ? ctx.index : index) || 0
}

export const useRecord = (record?: number) => {
  const ctx = useContext(ItemContext)
  return takeRecord(ctx ? ctx.record : record, ctx?.index)
}
