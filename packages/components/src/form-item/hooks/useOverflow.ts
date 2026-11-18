import { useEffect, useRef, useState } from 'react'

import { useFormLayout } from '../../form-layout'

export function useOverflow<Container extends HTMLElement, Content extends HTMLElement>() {
  const [overflow, setOverflow] = useState(false)
  const containerRef = useRef<Container>(null)
  const contentRef = useRef<Content>(null)
  const layout = useFormLayout()
  const labelCol = JSON.stringify(layout.labelCol)

  useEffect(() => {
    requestAnimationFrame(() => {
      if (containerRef.current && contentRef.current) {
        const contentWidth = contentRef.current.getBoundingClientRect().width
        const containerWidth = containerRef.current.getBoundingClientRect().width
        if (contentWidth && containerWidth && containerWidth < contentWidth) {
          setOverflow(prev => (prev ? prev : true))
        } else {
          setOverflow(prev => (prev ? false : prev))
        }
      }
    })
    // labelCol 只作为布局变化的重测触发器，测量本身在 DOM 上完成
    // oxlint-disable-next-line react/exhaustive-effect-dependencies
  }, [labelCol])

  return {
    overflow,
    containerRef,
    contentRef,
  }
}
