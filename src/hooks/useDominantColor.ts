import { useState, useEffect } from "react";

interface RGB {
    r: number;
    g: number;
    b: number;
}

export function useDominantColor(imageUrl: string) {
    const [color, setColor] = useState<string | null>(null);
    const [isDark, setIsDark] = useState<boolean>(true);

    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            canvas.width = 1;
            canvas.height = 1;

            // Draw the image resized to 1x1 to get the average color
            ctx.drawImage(img, 0, 0, 1, 1);

            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

            setColor(`rgb(${r}, ${g}, ${b})`);

            // Calculate brightness to determine if text should be light or dark
            // Formula: (R * 299 + G * 587 + B * 114) / 1000
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            setIsDark(brightness < 128);
        };

        img.onerror = () => {
            // Fallback if image fails to load or CORS issues
            setColor(null);
            setIsDark(true);
        };

    }, [imageUrl]);

    return { color, isDark };
}
