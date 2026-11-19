import cls from 'classnames'
import { createContext, useContext, useMemo } from 'react'
import type { CSSProperties, FC, PropsWithChildren, ReactNode } from 'react'

import { usePrefixCls } from '../__builtins__'
import { useResponsiveFormLayout } from './useResponsiveFormLayout'

/**
 * FormLayout 与 FormItem 共用的布局属性。
 *
 * 这里统一声明为单值形式，FormLayout 通过 Omit 后重新声明同名属性来支持响应式数组；
 * FormLayout 上的配置会通过上下文向下传递，FormItem 声明同名属性时优先生效，
 * 可以在单个字段上覆盖表单级配置。
 */
export interface IFormItemBaseProps {
  /** 类名前缀，与 antd ConfigProvider 的 prefixCls 保持一致 */
  prefixCls?: string
  /** 容器类名 */
  className?: string
  /** 容器行内样式 */
  style?: CSSProperties
  /** 是否在标签后显示冒号，默认为 true */
  colon?: boolean
  /** 标签超出可用宽度时是否换行 */
  labelWrap?: boolean
  /** 包裹组件超出可用宽度时是否换行 */
  wrapperWrap?: boolean
  /** 反馈信息是否占满整行，设置 inset 或 feedbackIcon 时自动开启 */
  fullness?: boolean
  /** 组件尺寸 */
  size?: 'small' | 'default' | 'large'
  /** 是否使用紧凑的内联布局 */
  inset?: boolean
  /** 是否显示边框，FormItem 默认为 true */
  bordered?: boolean
  /** 提示信息的展示形式，icon 为问号图标，text 为文本 */
  tooltipLayout?: 'icon' | 'text'
  /** 自定义提示图标 */
  tooltipIcon?: ReactNode
  /** 标签宽度，数值按像素处理，字符串可传任意 CSS 宽度值，auto 表示自适应 */
  labelWidth?: number | string
  /** 包裹组件宽度，数值按像素处理，字符串可传任意 CSS 宽度值，auto 表示自适应 */
  wrapperWidth?: number | string
  /** 布局方向 */
  layout?: 'vertical' | 'horizontal' | 'inline'
  /** 标签对齐方式 */
  labelAlign?: 'left' | 'right'
  /** 包裹组件对齐方式 */
  wrapperAlign?: 'left' | 'right'
  /** 标签占据的栅格列数 */
  labelCol?: number
  /** 包裹组件占据的栅格列数 */
  wrapperCol?: number
}

export interface IFormLayoutProps extends Omit<
  IFormItemBaseProps,
  'labelAlign' | 'wrapperAlign' | 'layout' | 'labelCol' | 'wrapperCol'
> {
  /** 标签对齐方式，支持按 breakpoints 传入数组 */
  labelAlign?: IFormItemBaseProps['labelAlign'] | NonNullable<IFormItemBaseProps['labelAlign']>[]
  /** 包裹组件对齐方式，支持按 breakpoints 传入数组 */
  wrapperAlign?: IFormItemBaseProps['wrapperAlign'] | NonNullable<IFormItemBaseProps['wrapperAlign']>[]
  /** 标签占据的栅格列数，支持按 breakpoints 传入数组 */
  labelCol?: IFormItemBaseProps['labelCol'] | NonNullable<IFormItemBaseProps['labelCol']>[]
  /** 包裹组件占据的栅格列数，支持按 breakpoints 传入数组 */
  wrapperCol?: IFormItemBaseProps['wrapperCol'] | NonNullable<IFormItemBaseProps['wrapperCol']>[]
  /** 布局方向，支持按 breakpoints 传入数组 */
  layout?: IFormItemBaseProps['layout'] | NonNullable<IFormItemBaseProps['layout']>[]
  /** 表单方向，rtl 时整体镜像 */
  direction?: 'rtl' | 'ltr'
  /** 是否只把部分配置（size、colon）透传给子级 */
  shallow?: boolean
  /** 反馈信息的展示形式 */
  feedbackLayout?: 'loose' | 'terse' | 'popover' | 'none'
  /** 响应式断点，数组属性按此切换取值 */
  breakpoints?: number[]
  /** 栅格间距 */
  spaceGap?: number
  /** 栅格列间距 */
  gridColumnGap?: number
  /** 栅格行间距 */
  gridRowGap?: number
}

export interface IFormLayoutContext extends Omit<
  IFormLayoutProps,
  'labelAlign' | 'wrapperAlign' | 'layout' | 'labelCol' | 'wrapperCol'
> {
  /** 标签对齐方式，响应式数组已解析为单值 */
  labelAlign?: IFormItemBaseProps['labelAlign']
  /** 包裹组件对齐方式，响应式数组已解析为单值 */
  wrapperAlign?: IFormItemBaseProps['wrapperAlign']
  /** 布局方向，响应式数组已解析为单值 */
  layout?: IFormItemBaseProps['layout']
  /** 标签占据的栅格列数，响应式数组已解析为单值 */
  labelCol?: IFormItemBaseProps['labelCol']
  /** 包裹组件占据的栅格列数，响应式数组已解析为单值 */
  wrapperCol?: IFormItemBaseProps['wrapperCol']
}

export const FormLayoutDeepContext = createContext<IFormLayoutContext>({})

export const FormLayoutShallowContext = createContext<IFormLayoutContext>({})

export const useFormDeepLayout = () => useContext(FormLayoutDeepContext)

export const useFormShallowLayout = () => useContext(FormLayoutShallowContext)

export const useFormLayout = () => ({
  ...useFormDeepLayout(),
  ...useFormShallowLayout(),
})

export const FormLayout: FC<PropsWithChildren<IFormLayoutProps>> = ({
  shallow = true,
  children,
  prefixCls,
  className,
  style,
  ...otherProps
}) => {
  const { ref, props } = useResponsiveFormLayout(otherProps)
  const deepLayout = useFormDeepLayout()
  const formPrefixCls = usePrefixCls('form', { prefixCls })
  const layoutPrefixCls = usePrefixCls('formvk-layout', { prefixCls })
  const layoutClassName = cls(
    layoutPrefixCls,
    {
      [`${formPrefixCls}-${props.layout}`]: true,
      [`${formPrefixCls}-rtl`]: props.direction === 'rtl',
      [`${formPrefixCls}-${props.size}`]: props.size,
    },
    className
  )
  const newDeepLayout = useMemo(() => {
    const layout: IFormLayoutContext = {
      ...deepLayout,
    }
    if (!shallow) {
      Object.assign(layout, props)
    } else {
      if (props.size) {
        layout.size = props.size
      }
      if (props.colon) {
        layout.colon = props.colon
      }
    }
    return layout
  }, [deepLayout, props, shallow])
  const renderChildren = () => {
    return (
      <FormLayoutDeepContext.Provider value={newDeepLayout}>
        <FormLayoutShallowContext.Provider value={shallow ? props : undefined}>
          {children}
        </FormLayoutShallowContext.Provider>
      </FormLayoutDeepContext.Provider>
    )
  }
  return (
    <div ref={ref} className={layoutClassName} style={style}>
      {renderChildren()}
    </div>
  )
}
