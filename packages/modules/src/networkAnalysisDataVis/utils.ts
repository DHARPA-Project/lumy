/**
 * Normalize numbers to be between 0 and 1.
 */
export const normalizeNumbers = (numbers: number[]): number[] => {
  if (numbers == null) return
  if (numbers.length === 0) return numbers
  const max = numbers.reduce((acc, v) => (v > acc ? v : acc), 0)
  return numbers.map(v => v / max)
}

export const normalizedValue = (value: number, min: number, max: number): number =>
  (value - min) / (max - min)
