import { Space as AntdSpace } from 'antd'
import type { SpaceProps } from 'antd/es/space'
import { createElement } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { useFormLayout } from '../form-layout'

export const Space: FC<PropsWithChildren<SpaceProps>> = props => {
  const layout = useFormLayout()
  return createElement(AntdSpace, {
    size: props.size ?? layout?.spaceGap,
    ...props,
  })
}
