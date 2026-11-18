import { genStyleHook } from './../__builtins__'

export const useStyle = genStyleHook('select-table', token => {
  const { componentCls } = token
  return {
    [componentCls]: {
      [`${componentCls}-search`]: {
        marginBottom: 8,
      },
    },
  }
})
