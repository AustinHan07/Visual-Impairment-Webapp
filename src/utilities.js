import { createContext } from "react";

export const drawRect = (detections, ctx) => {
    detections.forEach(prediction=>{
        const [x,y,width,height] = prediction['bbox'];
        const text = prediction['class'];   

        const color = 'green';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.font = "75px Arial";

        ctx.beginPath();
        ctx.fillText(text, x, y + 0.5 * height);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    })
}
