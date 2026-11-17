import { ExpressionScope } from '@formvk/react'
import type { ReactFC } from '@formvk/reactive-react'
import type { ReactNode } from 'react'

export interface IRecordScopeProps {
  getRecord: () => any
  getIndex?: () => number
  children?: ReactNode
}

export interface IRecordsScopeProps {
  getRecords: () => any[]
  children?: ReactNode
}

/**
 * formvk 未提供 RecordScope/RecordsScope，这里基于 ExpressionScope 等价实现。
 * value 经 lazyMerge 惰性合并，getter 在表达式取值时才执行，响应式追踪不丢失。
 */
export const RecordScope: ReactFC<IRecordScopeProps> = ({ getRecord, getIndex, children }) => {
  return (
    <ExpressionScope
      value={{
        get $record() {
          return getRecord()
        },
        get $index() {
          return getIndex?.()
        },
      }}
    >
      {children}
    </ExpressionScope>
  )
}

export const RecordsScope: ReactFC<IRecordsScopeProps> = ({ getRecords, children }) => {
  return (
    <ExpressionScope
      value={{
        get $records() {
          return getRecords()
        },
      }}
    >
      {children}
    </ExpressionScope>
  )
}
