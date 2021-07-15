import React from 'react'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardActionArea from '@material-ui/core/CardActionArea'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import Divider from '@material-ui/core/Divider'

import useStyles from './OptionCard.styles'

type OptionCardProps = {
  title: string
  subtitle: string
  image: JSX.Element
  clickHandler: () => void
}

const OptionCard = ({ title, subtitle, image, clickHandler }: OptionCardProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Card className={classes.cardWrapper}>
      <CardActionArea onClick={clickHandler}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2" align="center">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" align="center">
            {subtitle}
          </Typography>
        </CardContent>
        <div className={classes.cardImage}>{image}</div>
      </CardActionArea>

      <CardActions className={classes.cardActions}>
        <Divider className={classes.bottomDivider} />
        <Button className={classes.bottomButton} size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default OptionCard
