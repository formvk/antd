import type { Field } from '@formvk/core'
import { useField } from '@formvk/react'
import { observer, type ReactFC } from '@formvk/reactive-react'
import { isArr, isValid, toArr } from '@formvk/shared'
import { Space, Tag } from 'antd'
import type {
  CascaderProps,
  DatePickerProps,
  InputNumberProps,
  InputProps,
  SelectProps,
  TimePickerProps,
  TimeRangePickerProps,
  TreeSelectProps,
} from 'antd'
import type { DefaultOptionType } from 'antd/es/cascader'
import type { RangePickerProps as DateRangePickerProps } from 'antd/es/date-picker'
import cls from 'classnames'
import type { FC, HTMLAttributes, PropsWithChildren, ReactNode } from 'react'

import { usePlaceholder } from '../../hooks'
import { formatDayjsValue, usePrefixCls } from '../../shared'
import { useStyle } from './style'

export { Placeholder, PlaceholderContext, usePlaceholder } from '../../hooks'

export const TextInput: FC<PropsWithChildren<InputProps>> = observer(props => {
  const prefixCls = usePrefixCls('form-text', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <Space className={cls(prefixCls, hashId, props.className)} style={props.style}>
      {props.addonBefore}
      {props.prefix}
      {usePlaceholder(props.value)}
      {props.suffix}
      {props.addonAfter}
    </Space>
  )
})

export const TextInputNumber: FC<PropsWithChildren<InputNumberProps>> = observer(props => {
  const prefixCls = usePrefixCls('form-text', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  return wrapSSR(
    <Space className={cls(prefixCls, hashId, props.className)} style={props.style}>
      {props.addonBefore}
      {props.prefix}
      {usePlaceholder(
        props.formatter
          ? props.formatter(String(props.value), {
              userTyping: false,
              input: '',
            })
          : props.value
      )}
      {props['suffix']}
      {props.addonAfter}
    </Space>
  )
})

export const TextSelect: FC<PropsWithChildren<SelectProps<any>>> = observer(props => {
  const field = useField<Field>()
  const prefixCls = usePrefixCls('form-text', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)

  const dataSource: any[] = field?.dataSource?.length ? field.dataSource : props?.options?.length ? props.options : []
  const placeholder = usePlaceholder()
  const getSelected = () => {
    const value = props.value
    if (props.mode === 'multiple' || props.mode === 'tags') {
      if (props.labelInValue) {
        return isArr(value) ? value : []
      } else {
        return isArr(value) ? value.map(val => ({ label: val, value: val })) : []
      }
    } else {
      if (props.labelInValue) {
        return isValid(value) ? [value] : []
      } else {
        return isValid(value) ? [{ label: value, value }] : []
      }
    }
  }

  const getLabel = (target: any) => {
    const labelKey = props.fieldNames?.label || 'label'
    return (
      dataSource?.find(item => {
        const valueKey = props.fieldNames?.value || 'value'
        return item[valueKey] == target?.value
      })?.[labelKey] ||
      target.label ||
      placeholder
    )
  }

  const getLabels = () => {
    const selected = getSelected()
    if (!selected.length) return placeholder
    if (selected.length === 1) return getLabel(selected[0])
    return selected.map((item, key) => {
      /* eslint-disable-next-line react/no-array-index-key */
      return <Tag key={key}>{getLabel(item)}</Tag>
    })
  }
  return wrapSSR(
    <div className={cls(prefixCls, hashId, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
})

export const TextTreeSelect: FC<PropsWithChildren<TreeSelectProps<any>>> = observer(props => {
  const field = useField<Field>()
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const dataSource = field?.dataSource?.length ? field.dataSource : props?.treeData?.length ? props.treeData : []
  const getSelected = () => {
    const value = props.value
    if (props.multiple) {
      if (props.labelInValue) {
        return isArr(value) ? value : []
      } else {
        return isArr(value) ? value.map(val => ({ label: val, value: val })) : []
      }
    } else {
      if (props.labelInValue) {
        return value ? [value] : []
      } else {
        return value ? [{ label: value, value }] : []
      }
    }
  }

  const findLabel = (value: any, treeData: any[], treeNodeLabelProp?: string): ReactNode => {
    const valueKey = props.fieldNames?.value || 'value'
    for (let i = 0; i < treeData?.length; i++) {
      const item = treeData[i]
      if (item?.[valueKey] === value) {
        return item?.label ?? item[treeNodeLabelProp as string]
      } else {
        const childLabel: ReactNode = findLabel(value, item?.children, treeNodeLabelProp)
        if (childLabel) return childLabel
      }
    }
  }

  const getLabels = () => {
    const selected = getSelected()
    if (!selected?.length) return <Tag>{placeholder}</Tag>
    return selected.map(({ value, label }, key) => {
      /* eslint-disable-next-line react/no-array-index-key */
      return <Tag key={key}>{findLabel(value, dataSource, props.treeNodeLabelProp) || label || placeholder}</Tag>
    })
  }
  return wrapSSR(
    <div className={cls(prefixCls, hashId, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
})

export const TextCascader: FC<PropsWithChildren<CascaderProps<any>>> = observer(props => {
  const field = useField<Field>()
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const [wrapSSR, hashId] = useStyle(prefixCls)
  const dataSource: any[] = field?.dataSource?.length ? field.dataSource : props?.options?.length ? props.options : []
  const findSelectedItem = (items: DefaultOptionType[], val: string | number) => {
    return items.find(item => item.value == val)
  }
  const findSelectedItems = (
    sources: DefaultOptionType[],
    selectedValues: Array<string[] | number[]>
  ): Array<any[]> => {
    return selectedValues.map(value => {
      const result: Array<DefaultOptionType> = []
      let items = sources
      value.forEach(val => {
        const selectedItem = findSelectedItem(items, val)
        result.push({
          label: selectedItem?.label ?? '',
          value: selectedItem?.value,
        })
        items = selectedItem?.children ?? []
      })
      return result
    })
  }
  const getSelected = () => {
    const val = toArr(props.value)
    // unified conversion to multi selection mode
    return props.multiple ? val : [val]
  }
  const getLabels = () => {
    const selected = getSelected()
    const values = findSelectedItems(dataSource, selected)
    const labels = values
      .map((val: Array<DefaultOptionType>) => {
        return val.map(item => item.label).join('/')
      })
      .join(' ')
    return labels || placeholder
  }
  return wrapSSR(
    <div className={cls(prefixCls, hashId, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
})

export const TextDatePicker: FC<PropsWithChildren<DatePickerProps>> = props => {
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const getLabels = () => {
    const labels = formatDayjsValue(props.value, props.format, placeholder)
    return isArr(labels) ? labels.join('~') : labels
  }
  return <div className={cls(prefixCls, props.className)}>{getLabels()}</div>
}

export const TextDateRangePicker: FC<PropsWithChildren<DateRangePickerProps>> = props => {
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const getLabels = () => {
    const labels = formatDayjsValue(props.value, props.format, placeholder)
    return isArr(labels) ? labels.join('~') : labels
  }
  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
}

export const TextTimePicker: ReactFC<TimePickerProps> = props => {
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const getLabels = () => {
    const labels = formatDayjsValue(props.value, props.format, placeholder)
    return isArr(labels) ? labels.join('~') : labels
  }
  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
}

export const TextTimeRangePicker: FC<PropsWithChildren<TimeRangePickerProps>> = props => {
  const placeholder = usePlaceholder()
  const prefixCls = usePrefixCls('form-text', props)
  const getLabels = () => {
    const labels = formatDayjsValue(props.value, props.format, placeholder)
    return isArr(labels) ? labels.join('~') : labels
  }
  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {getLabels()}
    </div>
  )
}

export interface ITextProps extends HTMLAttributes<HTMLDivElement> {
  prefixCls?: string
  value?: any
}

const InternalText: ReactFC<ITextProps> = observer((props: PropsWithChildren<ITextProps>) => {
  const prefixCls = usePrefixCls('form-text', props)

  return (
    <div className={cls(prefixCls, props.className)} style={props.style}>
      {usePlaceholder(props.value)}
    </div>
  )
})

export const Text = InternalText
