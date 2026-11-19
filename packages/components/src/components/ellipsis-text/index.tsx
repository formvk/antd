import { Tooltip } from 'antd'
import type { TooltipProps } from 'antd'
import { useState } from 'react'
import type { CSSProperties, FC, ReactNode } from 'react'

import { useOverflow } from '../../hooks'

export interface EllipsisTextProps {
  children?: ReactNode
  tooltipProps?: TooltipProps
  style?: CSSProperties
}

/** 单行省略文本，内容溢出时通过 Tooltip 展示完整内容 */
export const EllipsisText: FC<EllipsisTextProps> = props => {
  const { children, tooltipProps, style } = props
  const { containerRef, contentRef, overflow } = useOverflow<HTMLDivElement, HTMLSpanElement>()
  const [open, setOpen] = useState(false)

  return (
    <Tooltip
      {...tooltipProps}
      title={children}
      open={overflow && open}
      onOpenChange={next => setOpen(overflow ? next : false)}
    >
      <div ref={containerRef} style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', ...style }}>
        <span ref={contentRef}>{children}</span>
      </div>
    </Tooltip>
  )
}
