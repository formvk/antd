import { message } from 'antd'
import type { ReactNode } from 'react'

export const loading = async (title: ReactNode = 'Loading...', processor: () => Promise<any>) => {
  // 用 holder 承载闭包内赋值，避免 TS 将 hide 窄化为 never
  const holder: { hide?: () => void } = {}
  const loadingTimer = setTimeout(() => {
    holder.hide = message.loading(title)
  }, 100)
  try {
    return await processor()
  } finally {
    holder.hide?.()
    clearTimeout(loadingTimer)
  }
}
