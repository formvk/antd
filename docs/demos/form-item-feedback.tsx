import { Form, arrayComponents, fieldComponents, voidComponents } from '@formvk/antd'
import { createExpression, createForm, createSchema, createSchemaOptions, SchemaField } from '@formvk/react'
import { useState } from 'react'

type FeedbackLayout = 'loose' | 'terse' | 'popover' | 'none'

// feedbackIcon 接受任意 ReactNode，这里用文本模拟图标
const CheckIcon = () => <span style={{ color: '#52c41a' }}>✓</span>
const CloseIcon = () => <span style={{ color: '#ff4d4f' }}>✕</span>

const { OptionsProvider, fragment: f } = createSchemaOptions({
  components: fieldComponents,
  voidComponents,
  arrayComponents,
  defaultDecorator: 'FormItem',
})

// 通过表达式把下拉框的值绑定到各字段的 feedbackLayout
const valuesExp = createExpression<{ feedbackLayout: FeedbackLayout }>('$values')

// schema 保持静态，feedbackLayout 由表达式驱动
const schema = createSchema({
  feedbackLayout: f.Select({
    title: 'feedbackLayout',
    enum: [
      { label: 'loose', value: 'loose' },
      { label: 'terse', value: 'terse' },
      { label: 'popover', value: 'popover' },
      { label: 'none', value: 'none' },
    ],
    componentProps: { style: { width: 220 } },
  }),
  error: f.Input({
    title: 'error',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'error',
      feedbackText: '校验失败',
    },
  }),
  warning: f.Input({
    title: 'warning',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'warning',
      feedbackText: '存在风险',
    },
  }),
  success: f.Input({
    title: 'success',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'success',
      feedbackText: '校验通过',
    },
  }),
  pending: f.Input({
    title: 'pending',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'pending',
      feedbackText: '校验中…',
    },
  }),
  customIcon: f.Input({
    title: '自定义成功图标',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'success',
      feedbackText: '已通过',
      feedbackIcon: <CheckIcon />,
    },
  }),
  customErrorIcon: f.Input({
    title: '自定义错误图标',
    decoratorProps: {
      feedbackLayout: valuesExp.feedbackLayout,
      feedbackStatus: 'error',
      feedbackText: '未通过',
      feedbackIcon: <CloseIcon />,
    },
  }),
})

export default () => {
  const [form] = useState(() => createForm({ values: { feedbackLayout: 'loose' } }))

  return (
    <OptionsProvider>
      <Form form={form}>
        <SchemaField schema={schema} />
      </Form>
    </OptionsProvider>
  )
}
