import React from 'react'

import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import Collapse from '@material-ui/core/Collapse'
import Checkbox from '@material-ui/core/Checkbox'

import useStyles from './PopoverSettingItem.styles'
import { SettingItem } from '../VisualizationSettings'

export interface PopoverSettingItemProps {
  setting: SettingItem
  setSettingList: React.Dispatch<React.SetStateAction<SettingItem[]>>
}

const PopoverSettingItem = ({ setting, setSettingList }: PopoverSettingItemProps): JSX.Element => {
  const classes = useStyles()

  const handleSettingSelection = () => {
    setSettingList(prevSettingList =>
      prevSettingList.map(item => (item.name === setting.name ? { ...item, selected: !item.selected } : item))
    )
  }

  const handleSubettingSelection = (subsettingName: string) => {
    setSettingList(prevSettingList =>
      prevSettingList.map(settingItem => {
        if (settingItem.name !== setting.name) return settingItem
        return {
          ...settingItem,
          subSettings: settingItem.subSettings.map(subsettingItem =>
            subsettingItem.name !== subsettingName
              ? subsettingItem
              : { ...subsettingItem, selected: !subsettingItem.selected }
          )
        }
      })
    )
  }

  return (
    <>
      <ListItem button onClick={handleSettingSelection}>
        <ListItemIcon>
          <Checkbox checked={setting.selected} edge="start" tabIndex={-1} />
        </ListItemIcon>
        <ListItemText primary={setting.name} />
      </ListItem>
      <Collapse in={setting.selected} timeout="auto" unmountOnExit>
        <List component="div">
          {setting.subSettings.map(subsetting => (
            <ListItem
              button
              onClick={() => handleSubettingSelection(subsetting.name)}
              className={classes.nested}
              key={subsetting.name}
            >
              <ListItemIcon>
                <Checkbox edge="start" checked={subsetting.selected} tabIndex={-1} />
              </ListItemIcon>
              <ListItemText primary={subsetting.name} />
            </ListItem>
          ))}
        </List>
      </Collapse>
    </>
  )
}

export default PopoverSettingItem
