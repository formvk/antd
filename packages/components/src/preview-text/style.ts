import { genStyleHook } from './../__builtins__'

export const useStyle = genStyleHook('preview-text', token => {
  const { componentCls, antCls, fontSize, fontWeightStrong } = token
  return [
    {
      [componentCls]: {
        fontSize,
        fontWeight: fontWeightStrong,

        [`${antCls}-tag:last-child`]: {
          marginInlineEnd: 0,
        },
      },
    },
  ]
})
