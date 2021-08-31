/**
 * declare modules here that do not provide types in order to suppress Typescript warnings
 */

declare module 'react-jupyter-notebook'
declare module '*.ipynb' {
  const src: string
  export default src
}

declare module '*.yml' {
  const src: string
  export default src
}

declare module '*.svg' {
  import React = require('react')
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}
