import { connect, mapReadPretty } from '@formvk/react'
import { InputNumber as AntdInputNumber } from 'antd'

import { TextInputNumber } from '../preview-text'

export const InputNumber = connect(AntdInputNumber, mapReadPretty(TextInputNumber))
