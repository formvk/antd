import { describe, expect, it } from 'vitest'

import {
  Addition,
  ArrayTableAddition,
  CollapsePanel,
  Column,
  Copy,
  Index,
  MoveDown,
  MoveUp,
  Remove,
  SortHandle,
  StepPane,
  TabPane,
} from '../index'
import { isComponentOf } from '../shared/component'

describe('组件 displayName', () => {
  it('数组操作组件通过组件引用也能被 isComponentOf 识别', () => {
    expect(isComponentOf(Addition, 'Addition')).toBe(true)
    expect(isComponentOf(ArrayTableAddition, 'Addition')).toBe(true)
    expect(isComponentOf(Copy, 'Copy')).toBe(true)
    expect(isComponentOf(Remove, 'Remove')).toBe(true)
    expect(isComponentOf(MoveUp, 'MoveUp')).toBe(true)
    expect(isComponentOf(MoveDown, 'MoveDown')).toBe(true)
    expect(isComponentOf(Index, 'Index')).toBe(true)
    expect(isComponentOf(SortHandle, 'SortHandle')).toBe(true)
  })

  it('结构标记组件通过组件引用也能被 isComponentOf 识别', () => {
    expect(isComponentOf(Column, 'Column')).toBe(true)
    expect(isComponentOf(CollapsePanel, 'CollapsePanel')).toBe(true)
    expect(isComponentOf(TabPane, 'TabPane')).toBe(true)
    expect(isComponentOf(StepPane, 'StepPane')).toBe(true)
  })
})
