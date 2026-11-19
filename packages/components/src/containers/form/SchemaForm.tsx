import { SchemaField } from '@formvk/react'
import type { SchemaReactComponents } from '@formvk/react'
import type { ISchema } from '@formvk/schema'
import type { ReactNode } from 'react'

import { Form } from '../../components/form'
import type { FormProps } from '../../components/form'

export interface SchemaFormProps extends FormProps {
  /** 表单 schema */
  schema?: ISchema
  /** 表达式作用域 */
  scope?: Record<string, unknown>
  /** 组件映射，由使用方自行传入，不预绑定内置组件 */
  components?: SchemaReactComponents
  children?: ReactNode
}

export const SchemaForm = (props: SchemaFormProps) => {
  const { schema, scope, components, children, ...rest } = props
  return (
    <Form {...rest}>
      <SchemaField schema={schema ?? {}} scope={scope} components={components} />
      {children}
    </Form>
  )
}
