import { useState, useEffect, MutableRefObject } from 'react'

export const useBbox = <T extends HTMLElement>(elementRef: MutableRefObject<T>): DOMRect | undefined => {
  const [bbox, setBbox] = useState<DOMRect>()

  const updateBbox = () => {
    if (elementRef.current == null) return
    setBbox(elementRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    updateBbox()
    window.addEventListener('resize', updateBbox)
    return () => window.removeEventListener('resize', updateBbox)
  }, [])

  useEffect(() => updateBbox(), [elementRef.current])

  return bbox
}
