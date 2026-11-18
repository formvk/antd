import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { Checkbox as AntdCheckbox } from 'antd'

import { TextSelect } from '../preview-text'

const InternalCheckbox: typeof AntdCheckbox = connect(
  AntdCheckbox,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  })
)

const Group = connect(
  AntdCheckbox.Group,
  mapProps({
    dataSource: 'options',
  }),
  mapReadPretty(TextSelect, {
    mode: 'tags',
  })
)

export const CheckboxGroup = Group

export const Checkbox = InternalCheckbox
