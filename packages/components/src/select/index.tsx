import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@formvk/react'
import type { ReactFC } from '@formvk/reactive-react'
import { Select as AntdSelect } from 'antd'
import type { SelectProps } from 'antd/es/select'

import { TextSelect } from '../preview-text'

export const Select: ReactFC<SelectProps<any, any>> = connect(
  AntdSelect,
  mapProps(
    {
      dataSource: 'options',
      loading: true,
    },
    (props, field) => {
      return {
        ...props,
        suffixIcon: (field as any)?.loading || (field as any)?.validating ? <LoadingOutlined /> : props.suffixIcon,
      }
    }
  ),
  mapReadPretty(TextSelect)
)
