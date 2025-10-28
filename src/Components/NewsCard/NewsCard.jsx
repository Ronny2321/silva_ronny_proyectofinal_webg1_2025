import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const NewsCard = ({news})=> {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={news.img}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {news.titulo}
            {news.subtitulo}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            <h6>{news.fecha}</h6>
            {news.noticia}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default NewsCard;