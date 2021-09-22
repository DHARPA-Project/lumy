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
  content: React.ReactNode
  startExpanded?: boolean
}

export const AccordionItem = ({ label, content, startExpanded }: AccordionItemProps): JSX.Element => {
  const classes = useStyles()

  const idRef = useRef(generateUniqueId())

  const { expanded, setExpanded, handleChange } = useContext(AccordionContext)

  useEffect(() => {
    if (startExpanded) setExpanded(idRef.current)
  }, [])

  return (
    <MuiAccordion
      classes={{
        root: classes.accordionRoot,
        expanded: classes.accordionExpanded
      }}
      expanded={expanded === idRef.current}
      onChange={handleChange(idRef.current)}
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
      <MuiAccordionDetails classes={{ root: classes.accordionDetailRoot }}>{content}</MuiAccordionDetails>
    </MuiAccordion>
  )
}
