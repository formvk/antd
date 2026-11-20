import { observer } from '@formvk/reactive-react'
import { useCallback } from 'react'

import { useTableModel, useTableScope } from '../../../../hooks'
import { SchemaForm } from '../../../form'
import type { SchemaFormProps } from '../../../form'

export type SearchFormProps = Omit<SchemaFormProps, 'form' | 'onAutoSubmit' | 'onAutoSubmitFailed'>

function SearchFormWidget(props: SearchFormProps) {
  const { scope, ...rest } = props
  const table = useTableModel()
  const expressionScope = useTableScope(scope)

  const onAutoSubmit = useCallback(async () => {
    await table.search()
  }, [table])

  return (
    <SchemaForm
      layout="inline"
      feedbackLayout="terse"
      wrapperWidth={200}
      {...rest}
      scope={expressionScope}
      form={table.form}
      onAutoSubmit={onAutoSubmit}
    />
  )
}

export const SearchForm = observer(SearchFormWidget)
