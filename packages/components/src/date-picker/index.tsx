import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { DatePicker as AntdDatePicker } from 'antd'
import type {
  DatePickerProps as AntdDatePickerProps,
  RangePickerProps as AntdRangePickerProps,
} from 'antd/es/date-picker'
import type dayjs from 'dayjs'
import type { FC, PropsWithChildren } from 'react'

import { dayjsable, formatDayjsValue } from '../__builtins__'
import { TextDatePicker, TextDateRangePicker } from '../preview-text'

type DatePickerProps<PickerProps> = Exclude<PickerProps, 'value' | 'onChange'> & {
  value: string
  onChange: (value: string | string[]) => void
}

const mapDateFormat = function () {
  const getDefaultFormat = (props: DatePickerProps<AntdDatePickerProps>) => {
    if (props['picker'] === 'month') {
      return 'YYYY-MM'
    } else if (props['picker'] === 'quarter') {
      return 'YYYY-\\QQ'
    } else if (props['picker'] === 'year') {
      return 'YYYY'
    } else if (props['picker'] === 'week') {
      return 'gggg-wo'
    }
    return props['showTime'] ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD'
  }
  return (props: any) => {
    const format = props['format'] || getDefaultFormat(props)
    const onChange = props.onChange
    return {
      ...props,
      format: format,
      value: dayjsable(props.value, format === 'gggg-wo' ? 'gggg-ww' : format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatDayjsValue(value, format))
        }
      },
    }
  }
}

const InternalDatePicker: typeof AntdDatePicker = connect(
  AntdDatePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(TextDatePicker)
)
const InternalRangePicker: typeof AntdDatePicker.RangePicker = connect(
  AntdDatePicker.RangePicker,
  mapProps(mapDateFormat()),
  mapReadPretty(TextDateRangePicker)
)

export const DatePicker = InternalDatePicker

export const DateRangePicker: FC<PropsWithChildren<AntdRangePickerProps>> = InternalRangePicker
