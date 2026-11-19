import { connect, mapReadPretty } from '@formvk/react'
import { InputNumber as AntdInputNumber, type InputNumberProps } from 'antd'
import type { InputFocusOptions } from 'antd/es/input/Input'
import type { FC, PropsWithChildren, RefAttributes } from 'react'

import { TextInputNumber } from '../preview-text'

export interface InputNumberRef extends HTMLInputElement {
  focus: (options?: InputFocusOptions) => void
  blur: () => void
  nativeElement: HTMLElement
}

export const InputNumber: FC<PropsWithChildren<InputNumberProps> & RefAttributes<InputNumberRef>> = connect(
  AntdInputNumber,
  mapReadPretty(TextInputNumber)
)
