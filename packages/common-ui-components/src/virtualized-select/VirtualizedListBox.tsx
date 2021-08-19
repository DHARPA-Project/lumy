import React, { createContext, forwardRef, useContext, useEffect, useRef } from 'react'
import { VariableSizeList, ListChildComponentProps } from 'react-window'

import useMediaQuery from '@material-ui/core/useMediaQuery'
import { useTheme } from '@material-ui/core/styles'

import ListSubheader from '@material-ui/core/ListSubheader'

const listBoxPadding = 8 // px

const OuterElementContext = createContext({})

const OuterElementType = forwardRef<HTMLDivElement>(function OuterElement(props, ref) {
  const outerProps = useContext(OuterElementContext)
  return <div ref={ref} {...props} {...outerProps} />
})

const useResetCache = (data: unknown) => {
  const ref = useRef<typeof VariableSizeList>(null)
  useEffect(() => {
    if (ref.current != null) {
      ref.current.resetAfterIndex(0, true)
    }
  }, [data])
  return ref
}

const renderRow = (props: typeof ListChildComponentProps) => {
  const { data, index, style } = props
  return React.cloneElement(data[index], {
    style: {
      ...style,
      top: (style.top as number) + listBoxPadding
    }
  })
}

// Adapter for react-window
const ListBox = forwardRef<HTMLDivElement>(function ListBox(props: { children?: React.ReactNode }, ref) {
  const { children, ...other } = props
  const itemData = React.Children.toArray(children)
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
  const itemCount = itemData.length
  const itemSize = smUp ? 36 : 48

  const getChildSize = (child: React.ReactNode) =>
    React.isValidElement(child) && child.type === ListSubheader ? 48 : itemSize

  const getHeight = () =>
    itemCount > 8 ? 8 * itemSize : itemData.map(getChildSize).reduce((a, b) => a + b, 0)

  const gridRef = useResetCache(itemCount)

  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <VariableSizeList
          itemData={itemData}
          height={getHeight() + 2 * listBoxPadding}
          width="100%"
          ref={gridRef}
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={(index: number) => getChildSize(itemData[index])}
          overscanCount={5}
          itemCount={itemCount}
        >
          {renderRow}
        </VariableSizeList>
      </OuterElementContext.Provider>
    </div>
  )
})

export default ListBox
