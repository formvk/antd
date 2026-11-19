import { createContext, useContext } from 'react'

import type { IFormLayoutContext } from '../components/form-layout'

export const FormLayoutDeepContext = createContext<IFormLayoutContext>({})

export const FormLayoutShallowContext = createContext<IFormLayoutContext>({})

export const useFormDeepLayout = () => useContext(FormLayoutDeepContext)

export const useFormShallowLayout = () => useContext(FormLayoutShallowContext)

export const useFormLayout = () => ({
  ...useFormDeepLayout(),
  ...useFormShallowLayout(),
})
