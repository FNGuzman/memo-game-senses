"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Lista de todas las imágenes (excluyendo back.png)
const imagenes = [
    "/assets/img/olfato2.png",
    "/assets/img/audicion2.png",
    "/assets/img/gusto2.png",
    "/assets/img/tacto2.png",
    "/assets/img/lavista2.png",
    "/assets/img/img1-4s.png",
    "/assets/img/olfato.png",
    "/assets/img/audicion.png",
    "/assets/img/gusto.png",
    "/assets/img/vista.png",
    "/assets/img/tacto.png",
];

export default function Conclusion() {
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement>(null);
    // Inicializar con la primera imagen del array para evitar string vacío
    const [imagenActual, setImagenActual] = useState(imagenes[0]);
    const [isVisible, setIsVisible] = useState(false);
    const [audioEnded, setAudioEnded] = useState(false);

    // Función para obtener una imagen aleatoria del array
    const obtenerImagenAleatoria = () => {
        const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
        return imagenes[indiceAleatorio];
    };

    useEffect(() => {
        // Iniciar con una imagen aleatoria
        const primeraImagen = obtenerImagenAleatoria();
        // Asegurar que nunca sea vacío
        setImagenActual(primeraImagen || imagenes[0]);
        setIsVisible(true);

        if (audioRef.current) {
            audioRef.current.play();

            // Detectar cuando el audio termina
            audioRef.current.onended = () => {
                setAudioEnded(true);
                // Redirigir al inicio después de que termine el audio
                // Se agrega un pequeño retraso para permitir ver la última imagen
                setTimeout(() => {
                    router.push('/');
                }, 200);
            };
        }

        // Cambiar la imagen cada 3 segundos con efecto
        const intervalo = setInterval(() => {
            // Si el audio ha terminado, no seguir cambiando imágenes
            if (audioEnded) {
                clearInterval(intervalo);
                return;
            }

            // Efecto de salida
            setIsVisible(false);

            // Después de la transición, cambiar la imagen y hacer efecto de entrada
            setTimeout(() => {
                const nuevaImagen = obtenerImagenAleatoria();
                // Asegurar que nunca sea vacío
                setImagenActual(nuevaImagen || imagenes[0]);
                setIsVisible(true);
            }, 10); // Tiempo de transición de salida

        }, 3500); // 3 segundos de visualización + 0.5 segundos de transición

        // Limpiar intervalo cuando el audio termine
        return () => {
            clearInterval(intervalo);
        };
    }, [audioEnded, router]);

    // Si por alguna razón imagenActual es vacío, usar la primera imagen
    const srcImagen = imagenActual || imagenes[0];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#fbe3c6] py-8">
            <div className="relative w-2/3 max-w-sm mb-10 h-56 flex items-center justify-center overflow-hidden">
                <img
                    src={srcImagen}
                    alt="Sentidos"
                    className={`
                        absolute max-h-52 w-auto object-contain rounded-2xl
                        transition-all duration-500 ease-in-out
                        ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                    `}
                />
            </div>

            <audio
                ref={audioRef}
                src="/assets/sounds/conclucion2.mp3"
                preload="auto"
            />

            <h2 className="text-xl font-bold text-[#b48c6e] mt-2 mb-6">¡Explorando el mundo con nuestros sentidos!</h2>

            <div className="mt-4 flex gap-4 relative z-10">
                <Link href="/">
                    <button className="bg-[#b48c6e] text-white py-2 px-6 rounded-lg hover:bg-[#a27b5e] transition duration-300">
                        Volver al inicio
                    </button>
                </Link>
                <Link href="/game">
                    <button className="bg-[#89b48c] text-white py-2 px-6 rounded-lg hover:bg-[#78a37b] transition duration-300">
                        Volver al juego
                    </button>
                </Link>
            </div>
        </div>
    );
} 