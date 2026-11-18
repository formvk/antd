import { observable } from '@formvk/reactive'
import { Observer, type ReactFC } from '@formvk/reactive-react'
import { Fragment } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'

import { render as reactRender, unmount as reactUnmount } from './render'

export interface IPortalProps {
  id?: string | symbol
}

const PortalMap = observable(new Map<string | symbol, ReactNode>())

export const createPortalProvider = (id: string | symbol) => {
  const Portal: ReactFC<IPortalProps> = props => {
    const portalId = props.id ?? id
    if (portalId && !PortalMap.has(portalId)) {
      PortalMap.set(portalId, null)
    }

    return (
      <Fragment>
        {props.children}
        <Observer>
          {() => {
            if (!portalId) return <></>
            const portal = PortalMap.get(portalId)
            if (portal) return createPortal(portal, document.body)
            return <></>
          }}
        </Observer>
      </Fragment>
    )
  }

  return Portal
}

export function createPortalRoot<T extends ReactNode>(host: HTMLElement, id: string) {
  function render(renderer?: () => T) {
    if (PortalMap.has(id)) {
      PortalMap.set(id, renderer?.())
    } else if (host) {
      reactRender(<Fragment>{renderer?.()}</Fragment>, host)
    }
  }

  function unmount() {
    if (PortalMap.has(id)) {
      PortalMap.set(id, null)
    }
    if (host) {
      void reactUnmount(host)
      if (host.parentNode) {
        host.parentNode.removeChild(host)
      }
    }
  }

  return {
    render,
    unmount,
  }
}
