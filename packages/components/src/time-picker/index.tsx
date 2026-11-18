import { connect, mapProps, mapReadPretty } from '@formvk/react'
import { TimePicker as AntdTimePicker } from 'antd'
import type {
  TimePickerProps as AntdTimePickerProps,
  TimeRangePickerProps as AntdTimeRangePickerProps,
} from 'antd/es/time-picker'
import type dayjs from 'dayjs'
import type { FC, PropsWithChildren } from 'react'

import { dayjsable, formatDayjsValue } from '../__builtins__'
import { TextTimePicker, TextTimeRangePicker } from '../preview-text'

type TimePickerProps = FC<PropsWithChildren<AntdTimePickerProps>>

const mapTimeFormat = function () {
  return (props: any) => {
    const format = props['format'] || 'HH:mm:ss'
    const onChange = props.onChange
    return {
      ...props,
      format,
      value: dayjsable(props.value, format),
      onChange: (value: dayjs.Dayjs | dayjs.Dayjs[]) => {
        if (onChange) {
          onChange(formatDayjsValue(value, format))
        }
      },
    }
  }
}

const InternalTimePicker: TimePickerProps = connect(
  AntdTimePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(TextTimePicker)
)

const InternalRangePicker: typeof AntdTimePicker.RangePicker = connect(
  AntdTimePicker.RangePicker,
  mapProps(mapTimeFormat()),
  mapReadPretty(TextTimeRangePicker)
)

export const TimePicker = InternalTimePicker

export const TimeRangePicker: FC<PropsWithChildren<AntdTimeRangePickerProps>> = InternalRangePicker
