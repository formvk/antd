import type { Form as FormType, IFormFeedback, ObjectField } from '@formvk/core'
import { isForm } from '@formvk/core'
import { FormProvider, useParentForm } from '@formvk/react'
import React from 'react'

import { RecordScope } from '../__builtins__'
import type { IFormLayoutProps } from '../form-layout'
import { FormLayout } from '../form-layout'
import { PreviewText } from '../preview-text'

export interface FormProps extends IFormLayoutProps {
  form?: FormType
  component?: React.ElementType
  onAutoSubmit?: (values: any) => any
  onAutoSubmitFailed?: (feedbacks: IFormFeedback[]) => void
  previewTextPlaceholder?: React.ReactNode
}

export const Form: React.FC<React.PropsWithChildren<FormProps>> = ({
  form,
  component = 'form',
  onAutoSubmit,
  onAutoSubmitFailed,
  previewTextPlaceholder,
  ...props
}) => {
  const top = useParentForm()
  const renderContent = (form: FormType | ObjectField) => (
    <RecordScope getRecord={() => (isForm(form) ? form.values : form.value)}>
      <PreviewText.Placeholder value={previewTextPlaceholder}>
        <FormLayout {...props}>
          {React.createElement(
            component as string,
            {
              onSubmit(e: React.FormEvent) {
                e?.stopPropagation?.()
                e?.preventDefault?.()
                form.submit(onAutoSubmit).catch(onAutoSubmitFailed)
              },
            },
            props.children
          )}
        </FormLayout>
      </PreviewText.Placeholder>
    </RecordScope>
  )
  if (form) return <FormProvider form={form}>{renderContent(form)}</FormProvider>
  if (!top) throw new Error('must pass form instance by createForm')
  return renderContent(top)
}

export default Form
