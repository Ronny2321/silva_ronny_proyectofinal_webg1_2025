import * as React from "react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cardAnimations, getAnimationVariant } from "../../utils/animations";
import LazyImage from "../Animations/LazyImage/LazyImage.jsx";
import "./NewsCard.css";

const NewsCard = ({ news }) => {
  const fmtDate = (val) => {
    if (!val) return "";
    if (typeof val === "string") return val;
    if (val?.toDate instanceof Function) {
      try {
        return val.toDate().toLocaleDateString("es-CO");
      } catch {
        return "";
      }
    }
    if (val?.seconds) {
      try {
        return new Date(val.seconds * 1000).toLocaleDateString("es-CO");
      } catch {
        return "";
      }
    }
    if (val instanceof Date) return val.toLocaleDateString("es-CO");
    return String(val);
  };

  const imgSrc = news.img || news.imagen;
  const dateStr = fmtDate(
    news.fechaPublicacion || news.fecha || news.fechaCreacion || news.createdAt
  );
  const estado = news.estado || news.status;
  const estadoClass = (() => {
    if (estado === "Publicado") return "status-published";
    if (estado === "Terminado") return "status-done";
    if (estado === "Desactivado") return "status-off";
    if (estado === "Edición") return "status-editing";
    return "";
  })();

  return (
    <motion.div
      className="news-card flex flex-col rounded-xl overflow-hidden"
      variants={getAnimationVariant(cardAnimations)}
      initial="initial"
      whileInView="animate"
      whileHover="hover"
      whileTap="tap"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={news.titulo || "Noticia"}
    >
      <Link to={`/noticia/${news.id}`}>
        <div className="card-figure w-full aspect-video bg-slate-200">
          {imgSrc ? (
            <LazyImage
              src={imgSrc}
              alt={news.titulo || "Imagen de noticia"}
              className="card-img"
              threshold={0.15}
            />
          ) : (
            <div className="card-img placeholder" aria-hidden />
          )}
          {news.categoria && <span className="badge">{news.categoria}</span>}
        </div>
        <div className="card-content p-3 grid gap-1">
          <h3 className="title text-base sm:text-lg md:text-xl font-serif">
            {news.titulo || "Sin título"}
          </h3>
          {news.subtitulo && (
            <p className="subtitle text-sm sm:text-base">{news.subtitulo}</p>
          )}
          <div className="meta">
            {dateStr && <span>{dateStr}</span>}
            {news.autor && <span>• {news.autor}</span>}
            {estado && (
              <span className={`status-badge ${estadoClass}`}>{estado}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;
