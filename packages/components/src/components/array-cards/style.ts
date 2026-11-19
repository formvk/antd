import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('array-cards', token => {
  const { componentCls, antCls } = token
  const arrayBase = `${antCls}-formvk-array-base`
  return {
    [componentCls]: {
      '&-item': {
        marginBottom: '10px !important',
      },

      [`${arrayBase}-copy`]: {
        marginInlineStart: 6,
      },
    },
  }
})
