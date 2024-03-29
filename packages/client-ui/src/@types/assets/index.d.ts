/**
 * declare modules here that do not provide types in order to suppress Typescript warnings
 */

declare module '*.yml' {
  const src: string
  export default src
}
declare module '*.ipynb' {
  const src: string
  export default src
}
declare module '*sampleCodeSnippet.js' {
  export const samplePythonCodeSnippet: string
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
