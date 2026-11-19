import { genStyleHook } from '../../shared'

export const useStyle = genStyleHook('form-button-group', token => {
  const { componentCls, antCls, colorBorder } = token
  return {
    [componentCls]: {
      '&-sticky': {
        padding: '10px 0',
        borderTop: `1px solid ${colorBorder}`,
        zIndex: 999,

        [`${componentCls}-sticky-inner`]: {
          display: 'flex',
          [`${antCls}-formvk-item`]: {
            flex: 2,
          },
        },
      },
    },
  }
})
