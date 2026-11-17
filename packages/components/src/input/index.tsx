import { LoadingOutlined } from '@ant-design/icons'
import { connect, mapProps, mapReadPretty } from '@formvk/react'
import type { ReactFC } from '@formvk/reactive-react'
import { Input as AntdInput } from 'antd'
import type { InputProps } from 'antd/es/input'

import { PreviewText } from '../preview-text'

const InternalInput: ReactFC<InputProps> = connect(
  AntdInput,
  mapProps((props, field) => {
    return {
      ...props,
      suffix: <span>{(field as any)?.loading || (field as any)?.validating ? <LoadingOutlined /> : props.suffix}</span>,
    }
  }),
  mapReadPretty(PreviewText.Input)
)
const TextArea = connect(AntdInput.TextArea, mapReadPretty(PreviewText.Input))

export const Input = Object.assign(InternalInput, {
  TextArea,
})

export default Input
