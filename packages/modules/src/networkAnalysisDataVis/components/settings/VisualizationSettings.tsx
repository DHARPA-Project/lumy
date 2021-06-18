import React, { useState } from 'react'

import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'

import AddCircleTwoToneIcon from '@material-ui/icons/AddCircleTwoTone'

import useStyles from './VisualizationSettings.styles'

import { NavigationPanel, NavigationPanelSection } from '../common/NavigationPanel'
import SettingMenuPopover from './popover/SettingMenuPopover'
import NodeSize from '../settings/subsettings/nodes/NodeSize'
import NodeLabel from '../settings/subsettings/nodes/NodeLabel'
import NodeColor from '../settings/subsettings/nodes/NodeColor'
import IsolatedNodes from '../settings/subsettings/layout/IsolatedNodes'

export interface SubsettingItem {
  name: string
  selected: boolean
  component: unknown
}

export interface SettingItem {
  name: string
  selected: boolean
  component: unknown
  subSettings: SubsettingItem[]
}

const initialSettingList: SettingItem[] = [
  {
    name: 'node appearance',
    selected: false,
    component: null,
    subSettings: [
      {
        name: 'size',
        selected: false,
        component: <NodeSize />
      },
      {
        name: 'label',
        selected: false,
        component: <NodeLabel />
      },
      {
        name: 'node color',
        selected: false,
        component: <NodeColor />
      }
    ]
  },
  {
    name: 'edge appearance',
    selected: false,
    component: null,
    subSettings: []
  },
  {
    name: 'layout/topology/filter',
    selected: false,
    component: null,
    subSettings: [
      {
        name: 'remove isolated nodes',
        selected: false,
        component: <IsolatedNodes />
      }
    ]
  },
  {
    name: 'shortest path',
    selected: false,
    component: null,
    subSettings: []
  },
  {
    name: 'community detection',
    selected: false,
    component: null,
    subSettings: []
  }
]

const VisualizationSettings = (): JSX.Element => {
  const classes = useStyles()

  const [settingList, setSettingList] = useState<SettingItem[]>(initialSettingList)
  const [popoverAnchorEl, setPopoverAnchorEl] = useState<HTMLButtonElement | null>(null)

  const handleOpenPopover = (event: React.MouseEvent<HTMLButtonElement>) => {
    setPopoverAnchorEl(event.currentTarget)
  }

  const handleClosePopover = () => {
    setPopoverAnchorEl(null)
  }

  return (
    <Card>
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
                    {(settingItem.subSettings ?? []).map(
                      subsetting =>
                        subsetting.selected && (
                          <Grid item className="subsetting-grid-item" key={subsetting.name}>
                            {subsetting.component ? (
                              subsetting.component
                            ) : (
                              <Typography variant="body1" component="h6" align="center">
                                {subsetting.name}
                              </Typography>
                            )}
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
