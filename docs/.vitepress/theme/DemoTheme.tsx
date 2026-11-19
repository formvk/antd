import { ConfigProvider, theme } from 'antd'
import { useEffect, useState } from 'react'
import type { ComponentType, FC, ReactNode } from 'react'

const useIsDark = () => {
  const [isDark, setIsDark] = useState(
    () => typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )

  useEffect(() => {
    const root = document.documentElement
    const sync = () => setIsDark(root.classList.contains('dark'))
    sync()
    const observer = new MutationObserver(sync)
    observer.observe(root, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

const DemoTheme: FC<{ children?: ReactNode }> = ({ children }) => {
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

/** 为文档 demo 注入 antd 主题，使其跟随 VitePress 明暗模式切换 */
export const withDemoTheme = <Props extends object>(Demo: ComponentType<Props>) => {
  const ThemedDemo: FC<Props> = props => (
    <DemoTheme>
      <Demo {...props} />
    </DemoTheme>
  )
  ThemedDemo.displayName = `withDemoTheme(${Demo.displayName ?? Demo.name ?? 'Demo'})`
  return ThemedDemo
}
