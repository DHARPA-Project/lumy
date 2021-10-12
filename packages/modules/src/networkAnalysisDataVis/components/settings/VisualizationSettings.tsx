import React, { useContext, useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone'

import useStyles from './VisualizationSettings.styles'
import { SettingContext } from '../../context'

import { NavigationPanel, NavigationPanelSection } from '../common/NavigationPanel'
import SettingMenuPopover from './popover/SettingMenuPopover'
import { settingComponentInventory } from '../../settingList'

const VisualizationSettings = (): JSX.Element => {
  const classes = useStyles()

  const { settingList, setSettingList } = useContext(SettingContext)

  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setPopoverAnchorEl(null)
  }

  return (
    <Card className={classes.settingContainer}>
      <div className={classes.header}>
        <Typography variant="body1" component="h6" align="center">
          Graph Settings
        </Typography>

        <Tooltip arrow title="enable required graph settings">
          <IconButton color="primary" onClick={handleOpenPopover} className={classes.popoverButton}>
            <AddCircleTwoToneIcon fontSize="small" />
          </IconButton>
        </Tooltip>

        <SettingMenuPopover
          anchorEl={popoverAnchorEl}
          isVisible={Boolean(popoverAnchorEl)}
          handleClose={handleClosePopover}
          settingList={settingList}
          setSettingList={setSettingList}
        />
      </div>

      <CardContent className={classes.settingCardContent}>
        <NavigationPanel>
          {(settingList ?? []).map(
            (settingItem, settingItemIndex) =>
              settingItem.selected && (
                <NavigationPanelSection
                  title={settingItem.name}
                  key={settingItemIndex}
                  index={settingItemIndex}
                >
                  <Grid container direction="column">
                    {(settingItem.children ?? []).map(
                      subsetting =>
                        subsetting.selected && (
                          <Grid item className="subsetting-grid-item" key={subsetting.name}>
                            {settingComponentInventory[subsetting.id]}
                          </Grid>
                        )
                    )}
                  </Grid>
                </NavigationPanelSection>
              )
          )}
        </NavigationPanel>
      </CardContent>
    </Card>
  )
}

export default VisualizationSettings
