import React from 'react'

import { MainProvider } from '../context'
import { OrientationType } from '../context'
import { ColorPalette as DividerPalette } from './PaneDivider'

import PaneContainer from './PaneContainer'

type ResizablePaneProps = {
  orientation: OrientationType
  minPaneSize: number
  dividerPalette: DividerPalette
  style?: React.CSSProperties
  children: React.ReactNode | React.ReactNode[]
}

export const ResizablePanes: React.FunctionComponent<ResizablePaneProps> = ({
  orientation,
  minPaneSize = 50,
  style,
  dividerPalette,
  children,
  ...otherProps
}: ResizablePaneProps) => {
  return (
    <MainProvider orientation={orientation} minPaneSize={minPaneSize} dividerPalette={dividerPalette}>
      <PaneContainer style={style} {...otherProps}>
        {children}
      </PaneContainer>
    </MainProvider>
  )
}
