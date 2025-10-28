import { useState, useEffect, use } from 'react'
import db from '../../FirebaseConfig/FirebaseConfig.js'
import { doc, setDoc } from "firebase/firestore";

const NewsForm = () => {

    
    const [noticia, setNoticia] = useState(null);

    useEffect(() => {
        console.log(noticia);
    }, [noticia]); 

    return (
        <div>
            <h2>News Form Component</h2>
            <input type="text" placeholder='Titulo' onChange={
                (e) => setNoticia({ ...noticia, titulo: e.target.value })
            } />
            <input type="text" placeholder='Subtitulo' onChange={
                (e) => setNoticia({ ...noticia, subtitulo: e.target.value })
            } />
            <input type="text" placeholder='Fecha' onChange={
                (e) => setNoticia({ ...noticia, fecha: e.target.value })
            } />
            <input type="text" placeholder='Imagen' onChange={
                (e) => setNoticia({ ...noticia, img: e.target.value })
            } />
            <textarea placeholder='Noticia'onChange={
                (e) => setNoticia({ ...noticia, noticia: e.target.value })
            } ></textarea>
            <button onClick={ async () => {
                const docRef = doc(db, "noticias", "noti3");
                await setDoc(docRef, noticia);
            } }>Guardar Noticia</button>
        </div>
    )
}

export default NewsForm