# 组件总览

`@formvk/antd` 提供与 formily-antd 对齐的表单组件桥接层，基于 Ant Design v6。

## 表单与布局

| 组件                                        | 说明                                         |
| ------------------------------------------- | -------------------------------------------- |
| [Form](/components/form#form)               | 表单容器，提供表单实例与默认布局             |
| [FormItem](/components/form#formitem)       | 字段装饰器，负责 label、校验反馈与布局       |
| [FormLayout](/components/form#formlayout)   | 布局配置容器，支持响应式断点                 |
| [FormGrid](/components/form#formgrid)       | 响应式栅格布局                               |
| [FormButtonGroup](/components/form#formbuttongroup) | 按钮组，支持吸附底部                 |
| [Submit](/components/form#submit--reset)    | 提交按钮                                     |
| [Reset](/components/form#submit--reset)     | 重置按钮                                     |
| [Space](/components/form#space)             | 间距容器，默认间距取自 `FormLayout.spaceGap` |

## 基础字段

| 组件                                                       | 说明                     |
| ---------------------------------------------------------- | ------------------------ |
| [Input](/components/fields#input)                          | 单行输入，支持 `Input.TextArea` |
| [Password](/components/fields#password)                    | 密码输入，可显示强度提示 |
| [Select](/components/fields#select)                        | 下拉选择                 |
| [TreeSelect](/components/fields#treeselect)                | 树选择                   |
| [Cascader](/components/fields#cascader)                    | 级联选择                 |
| [NumberPicker](/components/fields#numberpicker)            | 数字输入                 |
| [DatePicker](/components/fields#datepicker)                | 日期选择，支持 `DatePicker.RangePicker` |
| [TimePicker](/components/fields#timepicker)                | 时间选择，支持 `TimePicker.RangePicker` |
| [Checkbox](/components/fields#checkbox)                    | 复选框，支持 `Checkbox.Group` |
| [Radio](/components/fields#radio)                          | 单选框，支持 `Radio.Group` |
| [Switch](/components/fields#switch)                        | 开关                     |
| [Transfer](/components/fields#transfer)                    | 穿梭框                   |
| [Upload](/components/fields#upload)                        | 上传                     |
| [PreviewText](/components/fields#previewtext)              | 阅读态文本渲染           |

## 数组组件

| 组件                                    | 说明             |
| --------------------------------------- | ---------------- |
| [ArrayItems](/components/array#arrayitems)       | 列表             |
| [ArrayCards](/components/array#arraycards)       | 卡片列表         |
| [ArrayCollapse](/components/array#arraycollapse) | 折叠面板         |
| [ArrayTabs](/components/array#arraytabs)         | 标签页           |
| [ArrayTable](/components/array#arraytable)       | 可编辑表格       |
| [SelectTable](/components/array#selecttable)     | 表格选择         |

数组操作组件（`Addition` / `Remove` / `MoveUp` / `MoveDown` / `Copy` / `SortHandle` / `Index`）由 `ArrayBase` 提供，用法见 [数组组件指南](/guide/array#内置操作组件)。

## 高级组件

| 组件                                        | 说明                     |
| ------------------------------------------- | ------------------------ |
| [Editable](/components/advanced#editable)   | 内联编辑 / 弹层编辑      |
| [FormTab](/components/advanced#formtab)     | 标签页布局               |
| [FormCollapse](/components/advanced#formcollapse) | 折叠面板布局       |
| [FormStep](/components/advanced#formstep)   | 分步表单                 |

::: tip
本包不提供 `FormDialog` 与 `FormDrawer`。
:::
