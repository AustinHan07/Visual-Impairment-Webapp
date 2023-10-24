import { createContext } from "react";

export const drawRect = (detections, ctx) => {
    detections.forEach(prediction => {
        const [x, y, width, height] = prediction['bbox'];
        const text = prediction['class'];

        const color = 'green';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.beginPath();

        // Calculate the font size based on text length
        const textLength = text.length;
        const maxSize = Math.min(width, height);
        const fontSize = (maxSize / textLength) * 2.25; // Adjust the scaling factor as needed

        ctx.font = `${fontSize}px Arial`;

        ctx.fillText(text, x + width / 2, y + height / 2);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
}