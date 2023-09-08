import { createContext } from "react";

export const drawRect = (detections, ctx) => {
    detections.forEach(prediction=>{
        const [x,y,width,height] = prediction['bbox'];
        const text = prediction['class'];   


        const color = '#' + Math.floor(Math.random()*16777215).toString(16);
        ctx.strokeStyle = color
        ctx.Font = '18px Arial'
        ctx.fillStyle = color

        ctx.beginPath()
        ctx.fillText(text, x, y)
        ctx.rect(x, y, width, height)
        ctx.stroke()
    })
}