import React, { useContext, useEffect, useRef } from 'react'

import MuiAccordion from '@material-ui/core/Accordion'
import MuiAccordionSummary from '@material-ui/core/AccordionSummary'
import MuiAccordionDetails from '@material-ui/core/AccordionDetails'

import ArrowRightIcon from '@material-ui/icons/ArrowRight'

import { generateUniqueId } from '@lumy/client-core'
import useStyles from './AccordionItem.styles'

import { AccordionContext } from './AccordionContainer'

type AccordionItemProps = {
  label: React.ReactNode
  content?: React.ReactNode
  children?: React.ReactNode
  startExpanded?: boolean
}

export const AccordionItem = ({
  label,
  content,
  startExpanded,
  children
}: AccordionItemProps): JSX.Element => {
  const classes = useStyles()

  const idRef = useRef(generateUniqueId())

  const { expanded, addExpanded, removeExpanded } = useContext(AccordionContext)

  useEffect(() => {
    if (startExpanded) addExpanded(idRef.current)
  }, [])

  return (
    <MuiAccordion
      classes={{
        root: classes.accordionRoot,
        expanded: classes.accordionExpanded
      }}
      expanded={expanded.includes(idRef.current)}
      onChange={(event, shouldBeExpanded) =>
        shouldBeExpanded ? addExpanded(idRef.current) : removeExpanded(idRef.current)
      }
    >
      <MuiAccordionSummary
        expandIcon={<ArrowRightIcon />}
        classes={{
          root: classes.accordionSummaryRoot,
          content: classes.accordionSummaryContent,
          expanded: classes.accordionSummaryExpanded,
          expandIcon: classes.accordionSummaryExpandIcon
        }}
      >
        {label}
      </MuiAccordionSummary>
      <MuiAccordionDetails classes={{ root: classes.accordionDetailRoot }}>
        {content}
        {children}
      </MuiAccordionDetails>
    </MuiAccordion>
  )
}
