/**
 * declare modules here that do not provide types in order to suppress Typescript warnings
 */

declare module 'react-window'
declare module 'react-jupyter-notebook'
declare module 'react-syntax-highlighter'
declare module 'react-syntax-highlighter/dist/esm/styles/hljs'

declare module '*.ipynb' {
  const src: string
  export default src
}

declare module '*.yml' {
  const src: string
  export default src
}
