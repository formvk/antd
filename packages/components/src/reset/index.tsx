import type { IFieldResetOptions, IFormFeedback } from '@formvk/core'
import { isForm } from '@formvk/core'
import { useParentForm } from '@formvk/react'
import { isFn } from '@formvk/shared'
import { Button } from 'antd'
import type { ButtonProps } from 'antd/es/button'
import React from 'react'

export interface IResetProps extends IFieldResetOptions, ButtonProps {
  onClick?: (e: React.MouseEvent<Element, MouseEvent>) => any
  onResetValidateSuccess?: (payload: any) => void
  onResetValidateFailed?: (feedbacks: IFormFeedback[]) => void
}

export const Reset: React.FC<React.PropsWithChildren<IResetProps>> = ({
  forceClear,
  validate,
  onResetValidateSuccess,
  onResetValidateFailed,
  ...props
}) => {
  const form = useParentForm()
  return (
    <Button
      {...props}
      onClick={e => {
        if (isFn(props.onClick)) {
          if (props.onClick(e) === false) return
        }
        if (!form) return
        // Form.reset 接收 (pattern, options)；Field/ObjectField.reset 已固化 .** 模式，只接收 options
        const task = isForm(form)
          ? form.reset('*', {
              forceClear,
              validate,
            })
          : form.reset({
              forceClear,
              validate,
            })
        task.then(onResetValidateSuccess).catch(onResetValidateFailed)
      }}
    >
      {props.children}
    </Button>
  )
}

export default Reset
