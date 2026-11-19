import { createContext, useContext } from 'react'

import type { Grid } from '../components/form-grid/grid'

export const FormGridContext = createContext<Grid<HTMLElement>>(null as any)

export const useFormGrid = () => useContext(FormGridContext)
