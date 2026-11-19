import type { PopupModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import { Button, Drawer, Space } from 'antd'
import type { DrawerProps } from 'antd'

import { SchemaForm } from '../../form'
import type { SchemaFormProps } from '../../form'
import type { PopupTriggerEvent } from './ModalForm'

export interface DrawerFormProps
  extends
    Omit<DrawerProps, 'open' | 'onClose' | 'footer' | 'size'>,
    Omit<SchemaFormProps, 'form' | 'onAutoSubmit' | 'onAutoSubmitFailed'> {
  /** 弹窗表单模型，内部复用模型创建的 form 实例 */
  popup: PopupModel
  onOk?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
  onCancel?: (e: PopupTriggerEvent) => boolean | void | Promise<boolean | void>
}

export const DrawerForm = observer((props: DrawerFormProps) => {
  const { popup, onOk, onCancel, schema, scope, components, children, ...rest } = props

  const handleOk = async (e: PopupTriggerEvent) => {
    if ((await onOk?.(e)) === false) return
    await popup.onSubmit()
  }

  const handleCancel = async (e: PopupTriggerEvent) => {
    if ((await onCancel?.(e)) === false) return
    popup.close()
  }

  return (
    <Drawer
      size={600}
      {...rest}
      open={popup.visible}
      onClose={handleCancel}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Button type="primary" loading={popup.form.submitting} onClick={handleOk}>
            确定
          </Button>
        </Space>
      }
    >
      <SchemaForm form={popup.form} schema={schema} scope={scope} components={components}>
        {children}
      </SchemaForm>
    </Drawer>
  )
})
