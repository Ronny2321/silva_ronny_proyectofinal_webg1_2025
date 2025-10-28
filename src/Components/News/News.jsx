import { useState, useEffect } from "react";
import "./News.css";
import NewsCard from "../NewsCard/NewsCard.jsx";
import db from "../../FirebaseConfig/FirebaseConfig.js";
import { collection, getDocs } from "firebase/firestore";

const News = () => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const colRef = collection(db, "Noticias");
        const snap = await getDocs(colRef);
        const items = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setNews(items);
      } catch (err) {
        console.error("Error cargando noticias:", err);
      }
    };
    getData();
  }, []);

  return (
    <main>
      {news.length > 0 ? (
        news.map((n) => <NewsCard key={n.id} news={n} />)
      ) : (
        <p>Cargando noticias...</p>
      )}
    </main>
  );
};

export default News;
