import React, { useContext, Suspense } from 'react'
import { Box, Paper, Typography } from '@material-ui/core'
import { BackEndContext, ModuleProps } from '@lumy/client-core'
import useStyles from './ModuleView.styles'

export interface Props extends React.HTMLAttributes<HTMLElement> {
  moduleId: string
}

export const ModuleView = ({ moduleId, ...rest }: Props): JSX.Element => {
  const classes = useStyles()
  const context = useContext(BackEndContext)
  const provider = context.moduleViewProvider
  const [View, setView] = React.useState<React.FC<ModuleProps>>(undefined)

  React.useEffect(() => {
    provider.getModulePanel({ id: moduleId }).then(v => setView(() => v))
  }, [moduleId])

  if (View == null) return <pre>...</pre>

  return (
    <Box justifyContent="space-around" display="flex" {...rest}>
      <Paper className={classes.paper}>
        {moduleId == null ? (
          <Typography className={classes.cta} variant="h5">
            Select a module in the dropdown above.
          </Typography>
        ) : (
          <Suspense fallback={<pre>...</pre>}>
            <View pageDetails={{ id: moduleId, component: { id: moduleId } }} />
          </Suspense>
        )}
      </Paper>
    </Box>
  )
}
