import React from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'
import EditIcon from '@material-ui/icons/Edit'
import ViewIcon from '@material-ui/icons/Visibility'
import SimpleMde from 'react-simplemde-editor'
import { FormattedMessage } from '@lumy/i18n'

import { MarkdownRender } from './MarkdownRender'
import useStyles from './MarkdownEditorViewer.styles'
import { withI18n } from '../locale'

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

const MarkdownEditorViewerComponent = ({ text, onChanged, defaultTab = 'view' }: Props): JSX.Element => {
  const [tabId, setTabId] = React.useState(defaultTab == 'view' ? 1 : 0)
  const classes = useStyles()

  return (
    <Grid container wrap="nowrap" direction="column" spacing={0}>
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
          <Tab
            label={<FormattedMessage id="markdownEditor.tab.edit" />}
            icon={<EditIcon classes={{ root: classes.tabLabelIcon }} />}
            classes={{ root: classes.tabRoot, wrapper: classes.tabWrapper }}
          />
          <Tab
            label={<FormattedMessage id="markdownEditor.tab.view" />}
            icon={<ViewIcon classes={{ root: classes.tabLabelIcon }} />}
            classes={{ root: classes.tabRoot, wrapper: classes.tabWrapper }}
          />
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

export const MarkdownEditorViewer = withI18n(MarkdownEditorViewerComponent)
