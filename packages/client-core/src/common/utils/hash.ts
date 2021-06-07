import objectHash from 'object-hash'

const withoutNilValues = <T>(obj: T): T => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? withoutNilValues(v as T) : v])
  ) as T
}

export const getHash = <T>(v?: T): string => (v == null ? '' : objectHash(withoutNilValues(v)))
