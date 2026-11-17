import { isVoidField } from '@formvk/core'
import { connect, mapProps } from '@formvk/react'
import { Transfer as AntdTransfer } from 'antd'

const renderTitle = (item: any) => item.title ?? null

export const Transfer: typeof AntdTransfer = connect(
  AntdTransfer,
  mapProps(
    {
      value: 'targetKeys',
    },
    (props, field) => {
      if (isVoidField(field)) return props
      return {
        ...props,
        render: props.render || renderTitle,
        dataSource:
          field.dataSource?.map((item: any) => {
            return {
              ...item,
              title: item.title || item.label,
              key: item.key || item.value,
            }
          }) || [],
      }
    }
  )
)

export default Transfer
