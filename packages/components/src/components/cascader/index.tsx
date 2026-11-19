import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { Cascader as AntdCascader } from 'antd'

import { TextCascader } from '../preview-text'

export const Cascader: typeof AntdCascader = connect(
  AntdCascader,
  mapProps(
    {
      dataSource: 'options',
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: (field as any)?.loading || (field as any)?.validating ? <LoadingOutlined /> : props.suffixIcon,
      }
    }
  ),
  mapReadPretty(TextCascader)
)
