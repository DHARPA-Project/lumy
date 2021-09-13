import React from 'react'
import { LumyAutoUiComponentProps, LumyAutoUiComponent, ElementKind, getElement } from './registry'

export interface Props extends LumyAutoUiComponentProps {
  kind: ElementKind
}

export const ElementView = ({ kind, ...rest }: Props): JSX.Element => {
  const [LumyElement, setLumyElement] = React.useState<LumyAutoUiComponent>()
  const elementType = rest?.metadata?.schema?.type

  React.useEffect(() => {
    if (elementType == null) return
    const e = getElement(elementType, kind)
    setLumyElement(() => e)
  }, [kind, elementType])

  if (LumyElement == null) return <></>

  return <LumyElement {...rest} />
}
