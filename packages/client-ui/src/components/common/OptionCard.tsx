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
  image?: JSX.Element
  backgroundImage?: string
  clickHandler: () => void
}

const OptionCard = ({
  title,
  subtitle,
  image,
  backgroundImage,
  clickHandler
}: OptionCardProps): JSX.Element => {
  const classes = useStyles()

  return (
    <Card className={classes.cardWrapper}>
      <CardActionArea className={classes.cardTop} onClick={clickHandler}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="h2" align="center">
            {title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p" align="center">
            {subtitle}
          </Typography>
        </CardContent>

        <div className={classes.imageContainer}>
          {backgroundImage ? (
            <div className={classes.backgroundImage} style={{ backgroundImage: `url(${backgroundImage})` }} />
          ) : (
            image
          )}
        </div>

        <Divider className={classes.cardDivider} />
      </CardActionArea>

      <CardActions className={classes.cardBottom}>
        <Button className={classes.bottomButton} variant="text" size="small" color="primary">
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default OptionCard
