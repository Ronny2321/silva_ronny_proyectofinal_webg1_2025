import { useState, useEffect } from 'react'
import './News.css'
import NewsCard from '../NewsCard/NewsCard.jsx'
import db from '../../FirebaseConfig/FirebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";

const News = () => {

    const [news, setNews] = useState(null);

    useEffect(() => {
        const getData = async () => {
            const docRef = doc(db, "noticias", "noti1");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {                
                setNews({ id: docSnap.id, ...docSnap.data() });
            } else {
                // docSnap.data() will be undefined in this case
                console.log("No such document!");
            }
        }
        getData();
    }, []);

    return (
        <main>
            {news ? <NewsCard news={news} /> : <p>Loading...</p>}
        </main>
    )
}

export default News