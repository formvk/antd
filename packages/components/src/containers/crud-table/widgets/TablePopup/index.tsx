import { observer } from '@formvk/reactive-react'

import { useTableModel, useTableScope } from '../../../../hooks'
import type { DrawerFormProps, ModalFormProps } from '../../../popup'
import { PopupForm } from '../../../popup'
import type { PopupFormProps } from '../../../popup'

export type TablePopupProps =
  | (Omit<DrawerFormProps, 'popup'> & { type?: 'drawer' })
  | (Omit<ModalFormProps, 'popup'> & { type: 'modal' })

function createTablePopup(type: 'add' | 'edit') {
  const TablePopup = (props: TablePopupProps) => {
    const { scope, ...rest } = props
    const table = useTableModel()
    const expressionScope = useTableScope(scope)

    return (
      <PopupForm
        {...(rest as PopupFormProps)}
        popup={type === 'add' ? table.addPopup : table.editPopup}
        scope={expressionScope}
      />
    )
  }

  const Observed = observer(TablePopup)
  return Observed
}

/** 新增弹窗，复用 `table.addPopup` */
export const AddPopup = createTablePopup('add')
/** 编辑弹窗，复用 `table.editPopup` */
export const EditPopup = createTablePopup('edit')
