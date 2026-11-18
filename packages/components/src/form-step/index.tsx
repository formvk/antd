import type { Form, VoidField } from '@formvk/core'
import { connect, RecursionField, useField, useFieldSchema } from '@formvk/react'
import { action, observable, shallow } from '@formvk/reactive'
import { observer } from '@formvk/reactive-react'
import type { Schema, SchemaKey } from '@formvk/schema'
import { Steps } from 'antd'
import type { StepsProps } from 'antd/es/steps'
import cls from 'classnames'
import { Fragment } from 'react'
import type { FC, PropsWithChildren } from 'react'

import { isComponentOf, usePrefixCls } from '../__builtins__'

export interface IFormStep {
  connect: (steps: SchemaStep[], field: VoidField) => void
  current: number
  allowNext: boolean
  allowBack: boolean
  setCurrent(key: number): void
  submit: Form['submit']
  next(): void
  back(): void
}

export interface IFormStepProps extends StepsProps {
  formStep?: IFormStep
}

// antd v6 移除 Steps.Step 复合组件，StepProps 直接取 items 元素类型
export type StepProps = NonNullable<StepsProps['items']>[number]

type SchemaStep = {
  name: SchemaKey
  props: any
  schema: Schema
}

const parseSteps = (schema: Schema) => {
  const steps: SchemaStep[] = []
  schema.mapProperties((stepSchema, name) => {
    if (isComponentOf(stepSchema.component, 'StepPane')) {
      steps.push({
        name,
        props: stepSchema.componentProps,
        schema: stepSchema,
      })
    }
  })
  return steps
}

export const createFormStep = (defaultCurrent = 0): IFormStep => {
  // shallow：顶层 env 字段可响应，steps 元素及 Form/VoidField/Schema 等类实例保持原始引用
  const env = shallow({
    form: null as Form | null,
    field: null as VoidField | null,
    steps: [] as SchemaStep[],
  })

  const setDisplay = action.bound((target: number) => {
    const currentStep = env.steps[target]
    env.steps.forEach(({ name }) => {
      env.form?.query(`${env.field?.address}.${name}`).take(field => {
        if (name === currentStep.name) {
          field.setDisplay('visible')
        } else {
          field.setDisplay('hidden')
        }
      })
    })
  })

  const next = action.bound(() => {
    if (formStep.allowNext) {
      formStep.setCurrent(formStep.current + 1)
    }
  })

  const back = action.bound(() => {
    if (formStep.allowBack) {
      formStep.setCurrent(formStep.current - 1)
    }
  })

  // formvk reactive 无 model/markRaw：observable 承载 current 与方法，getter 自动获得响应式
  const formStep: IFormStep = observable({
    connect(steps, field) {
      env.steps = steps
      env.form = field?.form ?? null
      env.field = field ?? null
    },
    current: defaultCurrent,
    setCurrent(key: number) {
      setDisplay(key)
      formStep.current = key
    },
    get allowNext() {
      return formStep.current < env.steps.length - 1
    },
    get allowBack() {
      return formStep.current > 0
    },
    async next() {
      try {
        await env.form?.validate()
        if (env.form?.valid) {
          next()
        }
      } catch {
        // 校验失败时停留当前步，无需处理
      }
    },
    async back() {
      back()
    },
    async submit(onSubmit) {
      return env.form?.submit?.(onSubmit) as Promise<any>
    },
  })
  return formStep
}

export const FormStep = connect(
  observer(({ formStep, className, ...props }: IFormStepProps) => {
    const field = useField<VoidField>()
    const prefixCls = usePrefixCls('formvk-step', props)
    const schema = useFieldSchema()
    if (!field || !schema) return null
    const steps = parseSteps(schema)
    const current = props.current || formStep?.current || 0
    formStep?.connect?.(steps, field)
    return (
      <div className={cls(prefixCls, className)}>
        <Steps
          {...props}
          style={{ marginBottom: 10, ...props.style }}
          current={current}
          items={steps.map(({ props: stepProps }, key) => ({
            key,
            ...stepProps,
          }))}
        />
        {steps.map(({ name, schema: stepSchema }, index) => {
          if (index !== current) return
          return <RecursionField key={name} name={name} schema={stepSchema} />
        })}
      </div>
    )
  })
)

export const FormStepPane: FC<PropsWithChildren<StepProps>> = ({ children }) => {
  return <Fragment>{children}</Fragment>
}
