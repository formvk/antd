import { useEffect, useRef } from 'react'
import type { MutableRefObject, RefObject } from 'react'

const defaultEvent = 'click'

type EventType = MouseEvent | TouchEvent

type BasicTarget<T = HTMLElement> =
  | (() => T | null)
  | T
  | null
  | MutableRefObject<T | null | undefined>
  | RefObject<T | null | undefined>

type TargetElement = HTMLElement | Element | Document | Window

function getTargetElement(
  target?: BasicTarget<TargetElement>,
  defaultElement?: TargetElement
): TargetElement | undefined | null {
  if (!target) {
    return defaultElement
  }

  let targetElement: TargetElement | undefined | null

  if (typeof target === 'function') {
    targetElement = target()
  } else if ('current' in target) {
    targetElement = target.current
  } else {
    targetElement = target
  }

  return targetElement
}

export const useClickAway = (
  onClickAway: (event: EventType) => void,
  target: BasicTarget | BasicTarget[],
  eventName: string = defaultEvent
) => {
  const onClickAwayRef = useRef(onClickAway)

  useEffect(() => {
    onClickAwayRef.current = onClickAway
  })

  useEffect(() => {
    const handler = (event: EventType) => {
      const targets = Array.isArray(target) ? target : [target]
      if (
        targets.some(targetItem => {
          const targetElement = getTargetElement(targetItem) as HTMLElement
          return !targetElement || targetElement?.contains(event.target as Node)
        })
      ) {
        return
      }
      onClickAwayRef.current(event)
    }

    document.addEventListener(eventName, handler as EventListener)

    return () => {
      document.removeEventListener(eventName, handler as EventListener)
    }
  }, [target, eventName])
}
