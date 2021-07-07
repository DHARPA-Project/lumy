import React from 'react'
import { v4 as uuid } from 'uuid'
import { useDataRepositoryItemCreator, ItemCreationMethod } from '@dharpa-vre/client-core'
import { Button, Grid, TextField, Typography } from '@material-ui/core'
import useStyles from './AddDataRegistryItemPage.styles'
import { Alert } from '@material-ui/lab'

const methods: ItemCreationMethod[] = ['table.from_csv', 'onboarding.file.import']

const AddDataRegistryItemPage = (): JSX.Element => {
  const classes = useStyles()
  const [sessionId, setSessionId] = React.useState(uuid())
  const [status, addItem, errorMessage] = useDataRepositoryItemCreator(sessionId)
  const [method, setMethod] = React.useState<ItemCreationMethod>('table.from_csv')
  const [filePath, setFilePath] = React.useState<string>('')
  const [alias, setAlias] = React.useState<string>('')

  const clearForm = () => {
    setSessionId(uuid())
    setFilePath('')
    setAlias('')
  }

  const addToRegistry = () => addItem(method, filePath, alias)

  const formIsValid = methods.includes(method) && filePath.length > 0 && alias.length > 0

  return (
    <Grid container direction="column" className={classes.root} spacing={1}>
      <Grid item>
        <TextField
          select
          label="Method"
          value={method}
          onChange={e => setMethod(e.target.value as ItemCreationMethod)}
          SelectProps={{
            native: true
          }}
          variant="outlined"
        >
          {methods.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </TextField>
      </Grid>
      <Grid item>
        <TextField
          label="File path"
          variant="outlined"
          value={filePath}
          onChange={e => setFilePath(e.target.value)}
        />
      </Grid>
      <Grid item>
        <TextField label="Alias" variant="outlined" value={alias} onChange={e => setAlias(e.target.value)} />
      </Grid>
      <Grid item>
        {status === 'created' && (
          <Alert severity="success">
            Successfully added new item to data registry.{' '}
            <span onClick={clearForm} className={classes.linkButton}>
              Add another one
            </span>
            .
          </Alert>
        )}
        {status === 'error' && (
          <Alert severity="error">
            <Typography>{errorMessage ?? 'An error occurred'}</Typography>
          </Alert>
        )}
      </Grid>
      <Grid item>
        <Button onClick={addToRegistry} disabled={!formIsValid || status === 'creating'}>
          {status === 'creating' ? 'creating...' : 'Add to data registry'}
        </Button>
      </Grid>
    </Grid>
  )
}

export default AddDataRegistryItemPage
