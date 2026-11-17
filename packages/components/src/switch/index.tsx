import { connect, mapProps } from '@formvk/react'
import { Switch as AntdSwitch } from 'antd'

export const Switch: typeof AntdSwitch = connect(
  AntdSwitch,
  mapProps(
    {
      value: 'checked',
    },
    props => {
      delete props['value']
      return {
        ...props,
      }
    }
  )
)

export default Switch
