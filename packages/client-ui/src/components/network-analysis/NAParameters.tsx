import React, { useState } from 'react'

import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import useStyles from './NAParameters.styles'

const layoutAlgorithms = ['force-directed', 'algorithm 2', 'algorithm 3']
const nodeSizeOptions = ['weighted in degree', 'weighted out degree', 'cumulative centrality']
const communityDetectionAlgorithms = ['algorithm 1', 'algorithm 2', 'algorithm 3']

const computationTableValues = [
  { key: 'nodes', value: '231' },
  { key: 'edges', value: '854' },
  { key: 'average path length', value: '46' },
  { key: 'density', value: '89' },
  { key: 'diameter', value: '17' }
]

const NAParameters = (): JSX.Element => {
  const classes = useStyles()

  const [layoutAlgorithm, setLayoutAlgorithm] = useState<string>(layoutAlgorithms[0])
  const [nodeSize, setNodeSize] = useState<string>(nodeSizeOptions[0])
  const [communityAlgorithm, setCommunityAlgorithm] = useState<string>(communityDetectionAlgorithms[0])

  const handleLayoutAlgorithmChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setLayoutAlgorithm(event.target.value as string)
  }

  const handleNodeSizeOptionChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setNodeSize(event.target.value as string)
  }

  const handleCommunityAlgorithmChange = (event: React.ChangeEvent<{ value: unknown }>): void => {
    setCommunityAlgorithm(event.target.value as string)
  }

  return (
    <div className={classes.root}>
      <Accordion defaultExpanded square>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Summary</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionBlock}>
          <TableContainer>
            <Table aria-label="simple table">
              <TableBody>
                {computationTableValues.map(row => (
                  <TableRow key={row.key}>
                    <TableCell component="th" scope="row">
                      {row.key}
                    </TableCell>
                    <TableCell align="center">{row.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
          <Typography className={classes.heading}>Layout Algorithm</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionBlock}>
          <FormControl variant="outlined" size="small">
            <InputLabel>layout algorithm</InputLabel>
            <Select
              name="layoutAlgorithm"
              label="Layout Algorithm"
              value={layoutAlgorithm}
              onChange={handleLayoutAlgorithmChange}
            >
              {layoutAlgorithms.map((algorithm, index) => (
                <MenuItem key={index} value={algorithm}>
                  {algorithm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography className={classes.heading}>Node Size</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionBlock}>
          <Typography style={{ marginBottom: '1rem' }}>Adjust node size by</Typography>
          <FormControl variant="outlined" size="small">
            <InputLabel>node size priority</InputLabel>
            <Select
              name="nodeSize"
              label="Node Size Priority"
              value={nodeSize}
              onChange={handleNodeSizeOptionChange}
            >
              {nodeSizeOptions.map((nodeSizeOption, index) => (
                <MenuItem key={index} value={nodeSizeOption}>
                  {nodeSizeOption}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
      <Accordion disabled>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3a-content" id="panel3a-header">
          <Typography className={classes.heading}>Shortest Path</Typography>
        </AccordionSummary>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2a-content" id="panel2a-header">
          <Typography className={classes.heading}>Community Detection Algorithm</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionBlock}>
          <FormControl variant="outlined" size="small">
            <InputLabel>community detection algorithm</InputLabel>
            <Select
              name="communityAlgorithm"
              label="Community Detection Algorithm"
              value={communityAlgorithm}
              onChange={handleCommunityAlgorithmChange}
            >
              {communityDetectionAlgorithms.map((algorithm, index) => (
                <MenuItem key={index} value={algorithm}>
                  {algorithm}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}

export default NAParameters
