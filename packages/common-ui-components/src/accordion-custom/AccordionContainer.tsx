import React, { createContext, CSSProperties } from 'react'

type AccordionContainerProps = {
  children: React.ReactNode
  allowMultipleExpanded?: boolean
  style?: CSSProperties
  classNames?: string
}

type AccordionContextType = {
  expanded: string[]
  addExpanded: (panelId: string) => void
  removeExpanded: (panelId: string) => void
}

export const AccordionContext = createContext<AccordionContextType>(null)

export const AccordionContainer = ({
  children,
  allowMultipleExpanded = false,
  classNames = '',
  style
}: AccordionContainerProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState<string[]>([])

  const addExpanded = (idToggledPanel: string) => {
    if (expanded.includes(idToggledPanel)) return

    if (!allowMultipleExpanded) return setExpanded([idToggledPanel])

    setExpanded(prevExpanded => [...prevExpanded, idToggledPanel])
  }

  const removeExpanded = (idToggledPanel: string) => {
    if (!expanded.includes(idToggledPanel)) return

    setExpanded(prevExpanded => prevExpanded.filter(idExpandedPanel => idExpandedPanel !== idToggledPanel))
  }

  return (
    <AccordionContext.Provider value={{ expanded, addExpanded, removeExpanded }}>
      <div className={classNames} style={style}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}
