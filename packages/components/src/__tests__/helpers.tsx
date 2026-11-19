import { createSchemaOptions, SchemaField as BaseSchemaField } from '@formvk/react'
import type { ComponentProps } from 'react'

import {
  ArrayItems,
  CollapsePanel,
  Column,
  FormCollapse,
  FormGrid,
  FormItem,
  FormTab,
  Input,
  Select,
  SelectTable,
  TabPane,
} from '../index'

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: { Input, Select },
  voidComponents: {
    FormItem,
    FormGrid,
    FormTab,
    TabPane,
    FormCollapse,
    CollapsePanel,
    Column,
  },
  arrayComponents: { ArrayItems, SelectTable },
  defaultDecorator: 'FormItem',
})

const SchemaField = (props: ComponentProps<typeof BaseSchemaField>) => (
  <OptionsProvider>
    <BaseSchemaField {...props} />
  </OptionsProvider>
)

export { f, SchemaField }
