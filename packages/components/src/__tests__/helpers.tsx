import { createSchemaField } from '@formvk/react'

import {
  ArrayItems,
  FormCollapse,
  FormCollapsePanel,
  FormGrid,
  FormItem,
  FormTab,
  FormTabPane,
  Input,
  Select,
  SelectTable,
  SelectTableColumn,
} from '../index'

export const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, Select },
  voidComponents: {
    FormItem,
    FormGrid,
    FormTab,
    TabPane: FormTabPane,
    FormCollapse,
    CollapsePanel: FormCollapsePanel,
    Column: SelectTableColumn,
  },
  arrayComponents: { ArrayItems, SelectTable },
  defaultDecorator: 'FormItem',
})
