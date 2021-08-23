import { MutableRefObject, useEffect, useRef, useState } from 'react'

export const useBoxSize = <T extends HTMLElement>(elementRef: MutableRefObject<T>): DOMRect | undefined => {
  const [boxSize, setBoxSize] = useState<DOMRect>()

  const observerRef = useRef(
    new ResizeObserver(entries => {
      // watch only the first element (only one will be provided)
      setBoxSize(entries[0].contentRect)
    })
  )

  const updateBoxSize = () => {
    if (elementRef.current == null) return
    setBoxSize(elementRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    if (elementRef.current && observerRef.current) observerRef.current.observe(elementRef.current)

    return () => {
      if (elementRef.current && observerRef.current) observerRef.current.unobserve(elementRef.current)
    }
  }, [elementRef.current, observerRef.current])

  useEffect(() => {
    updateBoxSize()
    window.addEventListener('resize', updateBoxSize)
    return () => window.removeEventListener('resize', updateBoxSize)
  }, [])

  useEffect(() => updateBoxSize(), [elementRef.current])

  return boxSize
}
