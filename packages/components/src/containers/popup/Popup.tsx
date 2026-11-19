import type { FC } from 'react'

import { DrawerForm, ModalForm } from './widgets'
import type { DrawerFormProps, ModalFormProps } from './widgets'

export type PopupFormProps =
  | (DrawerFormProps & {
      /** 弹窗类型，默认为 drawer */
      type?: 'drawer'
    })
  | (ModalFormProps & {
      type: 'modal'
    })

export const PopupForm: FC<PopupFormProps> = props => {
  const { type, ...rest } = props
  return type === 'modal' ? <ModalForm {...(rest as ModalFormProps)} /> : <DrawerForm {...(rest as DrawerFormProps)} />
}
