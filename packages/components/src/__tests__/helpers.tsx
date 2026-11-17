import { createSchemaField } from '@formvk/react'

import { ArrayItems, FormCollapse, FormGrid, FormItem, FormTab, Input, Select, SelectTable } from '../index'

export const { SchemaField, fragment: f } = createSchemaField({
  components: { Input, Select },
  voidComponents: {
    FormItem,
    FormGrid,
    FormTab,
    TabPane: FormTab.TabPane,
    FormCollapse,
    CollapsePanel: FormCollapse.CollapsePanel,
    Column: SelectTable.Column,
  },
  arrayComponents: { ArrayItems, SelectTable },
  defaultDecorator: 'FormItem',
})
