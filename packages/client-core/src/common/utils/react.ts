// https://github.com/facebook/react/blob/5aa0c5671fdddc46092d46420fff84a82df558ac/packages/react/src/ReactLazy.js#L45

export type LazyResultPromise<R> = Promise<{ default: R }>
export type LazyResultPromiseCtor<R> = () => LazyResultPromise<R>

interface IntrospectedLazyComponent<R> {
  _payload: {
    _status: number
    _result: R | LazyResultPromise<R> | LazyResultPromiseCtor<R>
  }
}

export const isLazyComponent = <R>(c: unknown): c is IntrospectedLazyComponent<R> => {
  return typeof (c as IntrospectedLazyComponent<R>)?._payload?._status === 'number'
}

export const getResolvedReactComponent = async <T, P = unknown>(component: React.FC<P>): Promise<T> => {
  if (isLazyComponent<T>(component)) {
    const status = component._payload._status
    // ready
    if (status === 1) {
      return component._payload?._result as T
    }
    // rejected
    if (status === 2) {
      console.warn(`Could not load component ${component}. Loading of the lazy component has been rejected`)
      return undefined
    }
    // pending
    if (status === 0) {
      return (component._payload?._result as LazyResultPromise<T>).then(v => v.default)
    }
    // uninitialized
    if (status === -1) {
      const fn = component._payload?._result as LazyResultPromiseCtor<T>
      const promise = fn?.()
      if (promise != null) return promise.then(result => result.default)
      return undefined
    }
    console.warn(`Unknown status: ${status}`)
    return undefined
  }
  return (component as unknown) as T
}
