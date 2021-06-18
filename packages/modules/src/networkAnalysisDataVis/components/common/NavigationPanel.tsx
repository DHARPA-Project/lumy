import React from 'react'
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import useStyles from './NavigationPanel.styles'

interface OpenSectionIndexContext {
  sectionIndex: React.Key
  setSectionIndex: (index: React.Key) => void
}

const CurrentOpenSectionIndexContext = React.createContext<OpenSectionIndexContext>(null)

type NavigationPanelProps = Record<string, unknown>

/**
 * Convenient wrapper around MUI Accordion that displays only one panel at a time.
 */
export const NavigationPanel = ({ children }: React.PropsWithChildren<NavigationPanelProps>): JSX.Element => {
  const [sectionIndex, setSectionIndex] = React.useState<React.Key>(null)
  const context: OpenSectionIndexContext = {
    sectionIndex,
    setSectionIndex
  }

  return (
    <CurrentOpenSectionIndexContext.Provider value={context}>
      {children}
    </CurrentOpenSectionIndexContext.Provider>
  )
}

export interface NavigationPanelSection {
  title: string
  index: React.Key
}

export const NavigationPanelSection = ({
  children,
  index,
  title
}: React.PropsWithChildren<NavigationPanelSection>): JSX.Element => {
  const classes = useStyles()

  return (
    <CurrentOpenSectionIndexContext.Consumer>
      {context => {
        return (
          <Accordion
            classes={{ root: classes.accordion, expanded: classes.expandedAccordion }}
            expanded={context.sectionIndex === index}
            onChange={(_, isExpanded) => context.setSectionIndex(isExpanded ? index : null)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{title}</Typography>
            </AccordionSummary>

            <AccordionDetails>{children}</AccordionDetails>
          </Accordion>
        )
      }}
    </CurrentOpenSectionIndexContext.Consumer>
  )
}
