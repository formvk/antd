import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import type { ComponentType, FC, ReactNode } from 'react'

const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    const sync = () => {
      setIsDark(root.classList.contains('dark'))
    }
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

/** 让 demo 跟随 VitePress 明暗模式，在沙箱中回退为 antd 默认亮色主题 */
export const DemoTheme: FC<{ children?: ReactNode }> = ({ children }) => {
  const isDark = useIsDark()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: { fontFamily: 'inherit' },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

/** 为 demo 默认导出注入主题容器 */
export const withDemoTheme = <Props extends object>(Demo: ComponentType<Props>) => {
  const ThemedDemo: FC<Props> = props => (
    <DemoTheme>
      <Demo {...props} />
    </DemoTheme>
  )
  ThemedDemo.displayName = `withDemoTheme(${Demo.displayName ?? Demo.name ?? 'Demo'})`
  return ThemedDemo
}
