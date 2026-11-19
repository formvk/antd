import { observer } from '@formvk/reactive-react'
import cls from 'classnames'
import { useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, FC, PropsWithChildren } from 'react'

import { FormGridContext } from '../../hooks'
import { pickDataProps, usePrefixCls } from '../../shared'
import { useFormLayout } from '../form-layout'
import { Grid } from './grid'
import type { IGridOptions } from './grid'
import { useStyle } from './style'

export interface IFormGridProps extends IGridOptions {
  grid?: Grid<HTMLElement>
  prefixCls?: string
  className?: string
  style?: CSSProperties
}

export interface IGridColumnProps {
  gridSpan?: number
  style?: CSSProperties
  className?: string
}

export const createFormGrid = (props: IFormGridProps) => {
  return new Grid(props)
}

export { useFormGrid } from '../../hooks'

const InternalFormGrid = observer(
  ({ children, className, style, ...props }: PropsWithChildren<IFormGridProps>) => {
    const layout = useFormLayout()
    const options = {
      columnGap: layout?.gridColumnGap ?? 8,
      rowGap: layout?.gridRowGap ?? 4,
      ...props,
    }
    // 以 Grid.id 序列化结果作为重建依据（对齐参考实现 useMemo([Grid.id(options)]) 的语义），
    // 用渲染期 state 调整替代 effect/useMemo 复杂依赖表达式，满足 react-hooks 静态检查
    const gridId = Grid.id(options)
    const [gridState, setGridState] = useState(() => ({
      id: gridId,
      grid: options?.grid ? options.grid : new Grid(options),
    }))
    if (gridState.id !== gridId) {
      setGridState({
        id: gridId,
        grid: options?.grid ? options.grid : new Grid(options),
      })
    }
    const grid = gridState.grid
    const ref = useRef<HTMLDivElement>(null)
    const prefixCls = usePrefixCls('formvk-grid', props)

    const [wrapSSR, hashId] = useStyle(prefixCls)
    const dataProps = pickDataProps(props)
    useLayoutEffect(() => {
      if (ref.current) {
        return grid.connect(ref.current)
      }
    }, [grid])
    return (
      <FormGridContext.Provider value={grid}>
        {wrapSSR(
          <div
            {...dataProps}
            className={cls(`${prefixCls}-layout`, hashId, className)}
            style={{
              ...style,
              gridTemplateColumns: grid.templateColumns,
              gap: grid.gap,
            }}
            ref={ref}
          >
            {children}
          </div>
        )}
      </FormGridContext.Provider>
    )
  },
  {
    forwardRef: true,
  }
)

export const GridColumn: FC<PropsWithChildren<IGridColumnProps>> = observer(({ gridSpan = 1, children, ...props }) => {
  return (
    <div {...props} style={props.style} data-grid-span={gridSpan}>
      {children}
    </div>
  )
})

export const FormGrid = InternalFormGrid
