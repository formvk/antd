import type { PopupModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import { Modal } from 'antd'
import type { ModalProps } from 'antd'
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent } from 'react'

import { SchemaForm } from '../../form'
import type { SchemaFormProps } from '../../form'

/** 弹窗确认/取消回调的事件联合类型，同时覆盖鼠标与键盘触发 */
export type PopupTriggerEvent = KeyboardEvent | ReactKeyboardEvent<any> | ReactMouseEvent<any>

export interface ModalFormProps
  extends
    Omit<ModalProps, 'open' | 'onOk' | 'onCancel' | 'confirmLoading'>,
    Omit<SchemaFormProps, 'form' | 'onAutoSubmit' | 'onAutoSubmitFailed'> {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
}

export const ModalForm = observer((props: ModalFormProps) => {
  const { popup, onOk, onCancel, schema, scope, components, children, ...rest } = props

  return (
    <Modal
      {...rest}
      open={popup.visible}
      confirmLoading={popup.form.submitting}
      onOk={async e => {
        if ((await onOk?.(e)) === false) return
        await popup.onSubmit()
      }}
      onCancel={async e => {
        if ((await onCancel?.(e)) === false) return
        popup.close()
      }}
    >
      <SchemaForm form={popup.form} schema={schema} scope={scope} components={components}>
        {children}
      </SchemaForm>
    </Modal>
  )
})
