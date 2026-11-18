import { genStyleHook } from './../__builtins__'
export const useStyle = genStyleHook('form-grid', token => {
  const { componentCls } = token
  return {
    [`${componentCls}-layout`]: {
      display: 'grid',
    },
  }
})
