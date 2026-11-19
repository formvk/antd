import type { CSSProperties, ReactNode } from 'react'

import type { IFormItemBaseProps } from '../form-layout'

export interface IFormItemProps extends IFormItemBaseProps {
  label?: ReactNode
  tooltip?: ReactNode
  labelStyle?: CSSProperties
  wrapperStyle?: CSSProperties
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  extra?: ReactNode
  feedbackText?: ReactNode
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: ReactNode
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  asterisk?: boolean
  gridSpan?: number
}
