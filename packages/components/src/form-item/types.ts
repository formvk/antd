import type { CSSProperties, ReactNode } from 'react'

export interface IFormItemProps {
  className?: string
  style?: CSSProperties
  prefixCls?: string
  label?: ReactNode
  colon?: boolean
  tooltip?: ReactNode
  tooltipIcon?: ReactNode
  layout?: 'vertical' | 'horizontal' | 'inline'
  tooltipLayout?: 'icon' | 'text'
  labelStyle?: CSSProperties
  labelAlign?: 'left' | 'right'
  labelWrap?: boolean
  labelWidth?: number | string
  wrapperWidth?: number | string
  labelCol?: number
  wrapperCol?: number
  wrapperAlign?: 'left' | 'right'
  wrapperWrap?: boolean
  wrapperStyle?: CSSProperties
  fullness?: boolean
  addonBefore?: ReactNode
  addonAfter?: ReactNode
  size?: 'small' | 'default' | 'large'
  inset?: boolean
  extra?: ReactNode
  feedbackText?: ReactNode
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none' | (string & {})
  feedbackStatus?: 'error' | 'warning' | 'success' | 'pending' | (string & {})
  feedbackIcon?: ReactNode
  getPopupContainer?: (node: HTMLElement) => HTMLElement
  asterisk?: boolean
  gridSpan?: number
  bordered?: boolean
}
