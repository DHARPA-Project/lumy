import { useState, useEffect, MutableRefObject } from 'react'

export const useBoxSize = <T extends HTMLElement>(elementRef: MutableRefObject<T>): DOMRect | undefined => {
  const [boxSize, setBoxSize] = useState<DOMRect>()

  const updateBoxSize = () => {
    if (elementRef.current == null) return
    setBoxSize(elementRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    updateBoxSize()
    window.addEventListener('resize', updateBoxSize)
    return () => window.removeEventListener('resize', updateBoxSize)
  }, [])

  useEffect(() => updateBoxSize(), [elementRef.current])

  return boxSize
}
