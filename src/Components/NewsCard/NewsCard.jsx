import * as React from "react";
import { Link } from "react-router-dom";
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
    <Link
      to={`/noticia/${news.id}`}
      className="news-card flex flex-col rounded-xl overflow-hidden transition-transform duration-200 ease-in-out hover:scale-[1.01]"
      aria-label={news.titulo || "Noticia"}
    >
      <div className="card-figure w-full aspect-video bg-slate-200">
        {imgSrc ? (
          <img
            className="card-img"
            src={imgSrc}
            alt={news.titulo || "Imagen de noticia"}
            onError={(e) => {
              e.currentTarget.style.display = "none";
            }}
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
  );
};

export default NewsCard;
