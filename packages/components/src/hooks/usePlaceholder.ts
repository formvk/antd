import { isValid } from '@formvk/shared'
import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'

export const PlaceholderContext = createContext<ReactNode>('N/A')

export const Placeholder = PlaceholderContext.Provider

export const usePlaceholder = (value?: any) => {
  const placeholder = useContext(PlaceholderContext) || 'N/A'
  return isValid(value) && value !== '' ? value : placeholder
}
