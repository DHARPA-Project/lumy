import React, { useContext } from 'react'

import NativeSelect from '@material-ui/core/NativeSelect'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'

import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined'

import { WorkflowContext, featureIds, featureList } from '@dharpa-vre/client-ui'

import useStyles from './OptionSelector.styles'
import { NetworkGraphContext } from '../../context'

export interface Option {
  value: string
  label: string
}

export interface OptionSelectorProps {
  value: string
  options: Option[]
  label: string
  onValueChanged?: (value: string) => void
  documentationId?: string
  infoText?: string
}

export const OptionSelector = ({
  label,
  value,
  options,
  onValueChanged,
  documentationId
}: OptionSelectorProps): JSX.Element => {
  const classes = useStyles()

  const { setHighlightedDocItem } = useContext(NetworkGraphContext)
  const { openFeatureTab } = useContext(WorkflowContext)

  const openHelp = (helpItemId: string) => {
    if (!helpItemId) return console.warn('missing help item ID in OptionSelector')

    setHighlightedDocItem(helpItemId)
    const documentationTabIndex = featureList.findIndex(feature => feature.id === featureIds.documentation)
    if (documentationTabIndex >= 0) openFeatureTab(documentationTabIndex)
  }

  return (
    <div className={classes.optionSelectorContainer}>
      <div>
        <Typography variant="caption">{label}</Typography>
        <IconButton
          onClick={() => openHelp(documentationId)}
          color="primary"
          size="small"
          aria-label="expand"
        >
          <InfoOutlinedIcon color="disabled" fontSize="small" classes={{ root: classes.infoIcon }} />
        </IconButton>
      </div>

      <NativeSelect
        classes={{ root: classes.nativeSelectRoot }}
        value={value}
        onChange={e => onValueChanged?.(e.target.value)}
        fullWidth
      >
        {options.map(({ value, label }) => (
          <option value={value} key={value ?? ''}>
            {label}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
