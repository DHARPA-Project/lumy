import React from 'react'
import { Grid, TextareaAutosize } from '@material-ui/core'
import useStyles from './Main.styles'
import { PipelineUiSchema } from './types'
import { PipelineView } from './PipelineView'
import BlurOnIcon from '@material-ui/icons/BlurOn'

const LastUiSchemaKey = '__lumy_lastUiSchema'

const NoSchemaView = BlurOnIcon

const saveLastUiSchema = (schema: PipelineUiSchema): void => {
  if (schema == null) localStorage.removeItem(LastUiSchemaKey)
  else localStorage.setItem(LastUiSchemaKey, JSON.stringify(schema))
}

const getLastUischema = (): PipelineUiSchema => {
  try {
    return JSON.parse(localStorage.getItem(LastUiSchemaKey))
  } catch {
    return undefined
  }
}

export const AutoUiMainPanel = (): JSX.Element => {
  const classes = useStyles()
  const [uiSchemaContent, setUiSchemaContent] = React.useState<string>('')
  const [uiSchema, setUiSchema] = React.useState<PipelineUiSchema>(getLastUischema())

  React.useEffect(() => {
    if (uiSchema != null) setUiSchemaContent(JSON.stringify(uiSchema, null, 2))
  }, [])

  React.useEffect(() => {
    try {
      setUiSchema(JSON.parse(uiSchemaContent))
    } catch {
      setUiSchema(undefined)
    }
  }, [uiSchemaContent])

  React.useEffect(() => saveLastUiSchema(uiSchema), [uiSchema])

  return (
    <Grid container direction="column">
      <Grid item classes={{ root: classes.gridItemRoot }}>
        <TextareaAutosize
          rowsMin={3}
          rowsMax={9}
          className={classes.textarea}
          value={uiSchemaContent}
          onChange={e => setUiSchemaContent(e.target.value)}
        />
      </Grid>
      <Grid item classes={{ root: classes.gridItemRoot }}>
        {uiSchema == null ? <NoSchemaView /> : <PipelineView pipelineSchema={uiSchema} />}
      </Grid>
    </Grid>
  )
}
