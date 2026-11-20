import type { PopupModel } from '@formvk/models'
import { observer } from '@formvk/reactive-react'
import { Button, Drawer, Space } from 'antd'
import type { DrawerProps } from 'antd'
import type { ReactNode } from 'react'

import { useConfig } from '../../../hooks'
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
  /** 确定按钮文案，默认取 antd 全球化配置中的 Modal 文案 */
  okText?: ReactNode
  /** 取消按钮文案，默认取 antd 全球化配置中的 Modal 文案 */
  cancelText?: ReactNode
}

export const DrawerForm = observer((props: DrawerFormProps) => {
  const { popup, onOk, onCancel, schema, scope, components, children, okText, cancelText, ...rest } = props
  const { locale } = useConfig()

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
          <Button onClick={handleCancel}>{cancelText ?? locale?.Modal?.cancelText ?? 'Cancel'}</Button>
          <Button type="primary" loading={popup.form.submitting} onClick={handleOk}>
            {okText ?? locale?.Modal?.okText ?? 'OK'}
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
