import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { TreeSelect as AntdTreeSelect } from 'antd'

import { PreviewText } from '../preview-text'

export const TreeSelect: typeof AntdTreeSelect = connect(
  AntdTreeSelect,
  mapProps(
    {
      dataSource: 'treeData',
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: (field as any)?.loading || (field as any)?.validating ? <LoadingOutlined /> : props.suffixIcon,
      }
    }
  ),
  mapReadPretty(PreviewText.TreeSelect)
)

export default TreeSelect
