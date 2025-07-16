'use client';

import Image from "next/image";
import { useState} from "react";


export const NextImage = ({
                              src,
                              width,
                              height,
                              alt = "Image",
                              className = "",
                          }: {
    src: string;
    width?: number;
    height?: number;
    alt?: string;
    className?: string;
}) => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoad = () => {
        setIsLoading(false);
    };
    const handleError = () => {
        console.error("Image failed to load:", src);
        setIsLoading(false);
    };
    console.log(isLoading, "isLoading");
 
    if (!src) {
        return <div className="w-full h-full flex items-center justify-center">No image source provided</div>;
    }
 



    return (
        <Image
            src={src}
            width={width || 500}
            height={height || 500}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            style={{color:"transparent"}}
            className={`object-cover ${className}`}
            loading="lazy"
        />
    )
}
