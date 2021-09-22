import React, { createContext } from 'react'

type AccordionContainerProps = {
  children: React.ReactNode
}

type AccordionContextType = {
  expanded: string | false
  setExpanded: React.Dispatch<React.SetStateAction<string | false>>
  handleChange: (
    panel: string
  ) => (event: React.ChangeEvent<Record<string, unknown>>, newExpanded: boolean) => void
}

export const AccordionContext = createContext<AccordionContextType>(null)

export const AccordionContainer = ({ children }: AccordionContainerProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState<string | false>(false)

  const handleChange = (panel: string) => (
    event: React.ChangeEvent<Record<string, unknown>>,
    newExpanded: boolean
  ) => {
    setExpanded(newExpanded ? panel : false)
  }

  return (
    <AccordionContext.Provider value={{ expanded, setExpanded, handleChange }}>
      <div className="accordion-container">{children}</div>
    </AccordionContext.Provider>
  )
}
