import { connect, mapReadPretty } from '@formvk/react'
import { InputNumber } from 'antd'

import { TextNumberPicker } from '../preview-text'

export const NumberPicker: typeof InputNumber = connect(InputNumber, mapReadPretty(TextNumberPicker))
