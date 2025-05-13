import Image from 'next/image';
import { useState } from 'react';

interface MemoryCardProps {
    image: string;
    isFlipped: boolean;
    isMatched: boolean;
    onClick: () => void;
}

export default function MemoryCard({ image, isFlipped, isMatched, onClick }: MemoryCardProps) {
    // Si está en coincidencia, forzar que se vea solo la imagen del sentido
    if (isMatched) {
        return (
            <div className="relative w-24 h-24 sm:w-32 sm:h-32 opacity-50">
                <Image
                    src={image.replace('/app', '')}
                    alt="Imagen del sentido"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                />
            </div>
        );
    }
    const showFront = isFlipped;
    return (
        <div
            className={`relative w-24 h-24 sm:w-32 sm:h-32 cursor-pointer transition-transform duration-500 transform-style-3d perspective-1000 ${showFront ? 'rotate-y-180' : ''}`}
            onClick={onClick}
        >
            <div className="absolute w-full h-full backface-hidden">
                <Image
                    src="/assets/img/back.png"
                    alt="Reverso de la tarjeta"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                />
            </div>
            <div className="absolute w-full h-full backface-hidden rotate-y-180">
                <Image
                    src={image.replace('/app', '')}
                    alt="Imagen del sentido"
                    fill
                    className="object-cover rounded-lg shadow-lg"
                />
            </div>
        </div>
    );
} 