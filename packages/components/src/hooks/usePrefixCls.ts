import { ConfigProvider } from 'antd'
import { useContext } from 'react'

export const usePrefixCls = (
  tag?: string,
  props?: {
    prefixCls?: string
  }
) => {
  const config = useContext(ConfigProvider.ConfigContext)
  if (config?.getPrefixCls) {
    return config.getPrefixCls(tag, props?.prefixCls)
  }
  const prefix = props?.prefixCls ?? 'ant-'
  return `${prefix}${tag ?? ''}`
}
