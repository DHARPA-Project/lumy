export * from './components/network-force'

export function useElement(tagName: string): void {
  require(`./components/${tagName}`)
}
