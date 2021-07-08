import React from 'react'

import Popover from '@material-ui/core/Popover'
import ListSubheader from '@material-ui/core/ListSubheader'
import List from '@material-ui/core/List'

import useStyles from './SettingMenuPopover.styles'
import { SettingItem } from '../../../settingList'
import PopoverSettingItem from './PopoverSettingItem'

export interface SettingMenuPopoverProps {
  anchorEl: HTMLButtonElement | null
  isVisible: boolean
  handleClose: () => void
  settingList: SettingItem[]
  setSettingList: React.Dispatch<React.SetStateAction<SettingItem[]>>
}

const SettingMenuPopover = ({
  anchorEl,
  isVisible,
  handleClose,
  settingList,
  setSettingList
}: SettingMenuPopoverProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Popover
      id={isVisible ? 'setting-menu-popover' : undefined}
      open={isVisible}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left'
      }}
    >
      <List
        component="ul"
        aria-labelledby="nested-list-subheader"
        subheader={<ListSubheader component="div">Enable required graph settings</ListSubheader>}
        className={classes.list}
      >
        {settingList.map(setting => (
          <PopoverSettingItem key={setting.name} setting={setting} setSettingList={setSettingList} />
        ))}
      </List>
    </Popover>
  )
}

export default SettingMenuPopover
