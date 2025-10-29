import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";

const NewsCard = ({ news }) => {
  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={news.img || news.imagen}
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {news.titulo}
          </Typography>
          {news.subtitulo && (
            <Typography
              variant="subtitle1"
              component="h3"
              sx={{ color: "text.secondary" }}
            >
              {news.subtitulo}
            </Typography>
          )}
          <Typography
            variant="body2"
            component="div"
            sx={{ color: "text.secondary" }}
          >
            Fecha creación: {news.fechaCreacion || news.fecha}
          </Typography>
          {news.fechaActualizacion && (
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Fecha actualización: {news.fechaActualizacion}
            </Typography>
          )}
          {news.contenido && (
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Contenido: {news.contenido}
            </Typography>
          )}
          {news.categoria && (
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Categoría: {news.categoria}
            </Typography>
          )}
          {news.autor && (
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Autor: {news.autor}
            </Typography>
          )}
          {news.estado && (
            <Typography
              variant="body2"
              component="div"
              sx={{ color: "text.secondary" }}
            >
              Estado: {news.estado}
            </Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default NewsCard;
