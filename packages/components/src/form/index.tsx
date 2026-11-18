import type { Form as FormType, IFormFeedback, ObjectField } from '@formvk/core'
import { FormProvider, useParentForm } from '@formvk/react'
import { createElement } from 'react'
import type { ElementType, FC, FormEvent, PropsWithChildren, ReactNode } from 'react'

import type { IFormLayoutProps } from '../form-layout'
import { FormLayout } from '../form-layout'
import { Placeholder } from '../preview-text'

export interface FormProps extends IFormLayoutProps {
  form?: FormType
  component?: ElementType
  onAutoSubmit?: (values: any) => any
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void
  previewTextPlaceholder?: ReactNode
}

export const Form: FC<PropsWithChildren<FormProps>> = ({
  form,
  component = 'form',
  onAutoSubmit,
  onAutoSubmitFailed,
  previewTextPlaceholder,
  ...props
}) => {
  const top = useParentForm()
  const renderContent = (innerForm: FormType | ObjectField) => (
    <Placeholder value={previewTextPlaceholder}>
      <FormLayout {...props}>
        {createElement(
          component as string,
          {
            onSubmit(e: FormEvent) {
              e?.stopPropagation?.()
              e?.preventDefault?.()
              innerForm.submit(onAutoSubmit).catch(onAutoSubmitFailed)
            },
          },
          props.children
        )}
      </FormLayout>
    </Placeholder>
  )
  if (form) return <FormProvider form={form}>{renderContent(form)}</FormProvider>
  if (!top) throw new Error('must pass form instance by createForm')
  return renderContent(top)
}
