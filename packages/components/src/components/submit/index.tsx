import type { IFormFeedback } from '@formvk/core'
import { useParentForm } from '@formvk/react'
import { observer } from '@formvk/reactive-react'
import { Button } from 'antd'
import type { ButtonProps } from 'antd/es/button'
import type { FC, MouseEvent, PropsWithChildren } from 'react'

export interface ISubmitProps extends ButtonProps {
  onClick?: (e: MouseEvent<Element>) => any
  onSubmit?: (values: any) => any
  onSubmitSuccess?: (payload: any) => void
  onSubmitFailed?: (feedbacks: IFormFeedback[]) => void
}

export const Submit: FC<PropsWithChildren<ISubmitProps>> = observer(
  ({ onSubmit, onSubmitFailed, onSubmitSuccess, ...props }: ISubmitProps) => {
    const form = useParentForm()
    return (
      <Button
        htmlType={onSubmit ? 'button' : 'submit'}
        type="primary"
        {...props}
        loading={props.loading !== undefined ? props.loading : form?.submitting}
        onClick={e => {
          if (props.onClick) {
            if (props.onClick(e) === false) return
          }
          if (onSubmit && form) {
            form.submit(onSubmit).then(onSubmitSuccess).catch(onSubmitFailed)
          }
        }}
      >
        {props.children}
      </Button>
    )
  },
  {
    forwardRef: true,
  }
)
