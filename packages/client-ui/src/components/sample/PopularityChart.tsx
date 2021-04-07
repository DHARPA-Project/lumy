import React from 'react'

import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from 'recharts/lib'

import { useTheme } from '@material-ui/core/styles'

import Typography from '@material-ui/core/Typography'

import getDataToDisplay from './PopularityChart.utils'

const PopularityChart: React.FC = () => {
  const theme = useTheme()

  return (
    <>
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        Users This Week
      </Typography>

      <ResponsiveContainer>
        <LineChart
          data={getDataToDisplay()}
          margin={{
            top: 16,
            right: 16,
            bottom: 16,
            left: 24
          }}
        >
          <XAxis dataKey="day" stroke={theme.palette.text.secondary} dy={0}></XAxis>
          <YAxis stroke={theme.palette.text.secondary}>
            <Label
              angle={270}
              position="left"
              style={{ textAnchor: 'middle', fill: theme.palette.text.primary }}
            >
              Users
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={true} />
        </LineChart>
      </ResponsiveContainer>
    </>
  )
}

export default PopularityChart
