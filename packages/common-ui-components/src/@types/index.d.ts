/**
 * declare modules here that do not provide types in order to suppress Typescript warnings
 */

declare module 'react-window'

declare module '*.yml' {
  const src: string
  export default src
}
