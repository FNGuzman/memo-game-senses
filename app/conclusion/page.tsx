"use client";
import { useEffect, useRef, useState } from "react";

const imagenes = [
    { src: "/assets/img/img1-4s.png", tiempo: 0 },
    // Puedes agregar más imágenes y tiempos aquí si lo deseas
];

export default function Conclusion() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [imagenActual, setImagenActual] = useState(0);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.play();
        }
        // Cambia la imagen según el tiempo (ejemplo simple)
        const timers = imagenes.map((img, idx) =>
            setTimeout(() => setImagenActual(idx), img.tiempo)
        );
        return () => timers.forEach(clearTimeout);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbe3c6]">
            <img src={imagenes[imagenActual].src} alt="Conclusión" className="w-2/3 max-w-md mb-6" />
            <audio ref={audioRef} src="/assets/sounds/conclucion2.mp3" preload="auto" />
            <h2 className="text-xl font-bold text-[#b48c6e] mt-4">¡Explorando el mundo con nuestros sentidos!</h2>
        </div>
    );
} 