import { MutableRefObject, useEffect, useState, useRef } from 'react'

interface Options {
  useResizeObserver?: boolean
}

export const useBoxSize = <T extends HTMLElement>(
  elementRef: MutableRefObject<T>,
  options?: Options
): DOMRect | undefined => {
  const [boxSize, setBoxSize] = useState<DOMRect>()

  const observerRef = useRef(
    options?.useResizeObserver
      ? new ResizeObserver(entries => {
          // watch only the first element (only one will be provided)
          setBoxSize(entries[0].contentRect)
        })
      : undefined
  )

  const updateBoxSize = () => {
    if (elementRef.current == null) return
    setBoxSize(elementRef.current.getBoundingClientRect())
  }

  useEffect(() => {
    if (elementRef.current && observerRef.current && options?.useResizeObserver)
      observerRef.current.observe(elementRef.current)

    return () => {
      if (elementRef.current && observerRef.current && options?.useResizeObserver)
        observerRef.current.unobserve(elementRef.current)
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
