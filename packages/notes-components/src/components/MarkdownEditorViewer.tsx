import React from 'react'
import { Grid, Tabs, Tab } from '@material-ui/core'
import micromark from 'micromark'
import SimpleMde from 'react-simplemde-editor'
import 'easymde/dist/easymde.min.css'

export interface Props {
  text: string
  onChanged?: (text: string) => void
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

const asHtml = (markdown: string): string => micromark(markdown)

export const MarkdownEditorViewer = ({ text, onChanged }: Props): JSX.Element => {
  const [tabId, setTabId] = React.useState(0)

  return (
    <Grid container wrap="nowrap" direction="column">
      <Grid item>
        <Tabs value={tabId} onChange={(_, idx) => setTabId(idx)}>
          <Tab label="Edit" />
          <Tab label="View" />
        </Tabs>
      </Grid>
      <Grid item>
        <TabPanel value={tabId} index={0}>
          <SimpleMde value={text} onChange={onChanged} />
        </TabPanel>
        <TabPanel value={tabId} index={1}>
          <div dangerouslySetInnerHTML={{ __html: asHtml(text) }} />
        </TabPanel>
      </Grid>
    </Grid>
  )
}
