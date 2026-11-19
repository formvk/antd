import { genStyleHook } from '../../shared'
export const useStyle = genStyleHook('array-collapse', token => {
  const { componentCls } = token
  return {
    [componentCls]: {
      '&-item': {
        marginBottom: '10px !important',
      },
    },
  }
})
