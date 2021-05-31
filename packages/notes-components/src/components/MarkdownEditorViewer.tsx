import React from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import SimpleMde from 'react-simplemde-editor'
import { MarkdownRender } from './MarkdownRender'
import useStyles from './MarkdownEditorViewer.styles'

// https://github.com/Ionaru/easy-markdown-editor#configuration
const editorOptions: Parameters<typeof SimpleMde>[0]['options'] = {
  status: false,
  hideIcons: ['side-by-side', 'fullscreen', 'preview'],
  spellChecker: false
}

export interface Props {
  text: string
  onChanged?: (text: string) => void
  defaultTab?: 'view' | 'edit'
}

interface TabPanelProps {
  value: number
  index: number
  children: React.ReactChild | React.ReactChild[]
}
const TabPanel = ({ value, index, children }: TabPanelProps): JSX.Element => {
  if (value === index) return <>{children}</>
  return <></>
}

export const MarkdownEditorViewer = ({ text, onChanged, defaultTab = 'view' }: Props): JSX.Element => {
  const [tabId, setTabId] = React.useState(defaultTab == 'view' ? 1 : 0)
  const classes = useStyles()

  return (
    <Grid container wrap="nowrap" direction="column" spacing={1}>
      <Grid item>
        <Tabs
          value={tabId}
          onChange={(_, idx) => setTabId(idx)}
          classes={{
            flexContainer: classes.tabBarContainer
          }}
          indicatorColor="primary"
          scrollButtons="off"
        >
          <Tab label="Edit" icon={<EditIcon />} />
          <Tab label="View" icon={<ViewIcon />} />
        </Tabs>
      </Grid>
      <Grid item className={classes.mainSectionContainer}>
        <TabPanel value={tabId} index={0}>
          <SimpleMde value={text} onChange={onChanged} options={editorOptions} />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <MarkdownRender content={text} />
        </TabPanel>
      </Grid>
    </Grid>
  )
}
