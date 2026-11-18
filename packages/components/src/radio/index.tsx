import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { Radio as AntdRadio } from 'antd'

import { TextSelect } from '../preview-text'

export const InternalRadio: typeof AntdRadio = connect(
  AntdRadio,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  })
)

const Group = connect(
  AntdRadio.Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect)
)

export const RadioGroup = Group

export const Radio = InternalRadio
