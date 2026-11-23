import type { GenerateStyle } from '../../../shared'

export const getGridStyle: GenerateStyle = token => {
  const { componentCls } = token

  const colCls = `${componentCls}-item-col`

  const genGrid = (grid: number) => {
    return {
      flex: `0 0 ${(grid / 24) * 100}%`,
      maxWidth: `${(grid / 24) * 100}%`,
    }
  }
  const genGrids = () => {
    return Object.fromEntries(Array.from({ length: 24 }, (_, i) => [`${colCls}-${i + 1}`, genGrid(i + 1)]))
  }

  return {
    [componentCls]: {
      ...genGrids(),
    },
  }
}
