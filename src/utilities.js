import { createContext } from "react";

export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];

    const color = "green";
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
};

export const printObjects = (detections, ctx) => {
  detections.forEach((prediction) => {
    console.log(prediction);

    // Get the class, score, and positions of the prediction
    const text = prediction.class;
    const score = prediction.score.toFixed(2);
    const positions = prediction.positions;

    // Set the font and color of the text
    const color = "green";
    ctx.fillStyle = color;
    ctx.textAlign = "center";

    // Calculate the font size based on text length
    const textLength = text.length;
    const maxSize = Math.min(prediction.bbox[2], prediction.bbox[3]);
    const fontSize = (maxSize / textLength) * 2.25; // Adjust the scaling factor as needed

    ctx.font = `${fontSize}px Arial`;

    // Print the class and score at the center of the bounding box
    ctx.fillText(
      `${text}: ${score}`,
      prediction.bbox[0] + prediction.bbox[2] / 2,
      prediction.bbox[1] + prediction.bbox[3] / 2
    );

    // Print the positions below the bounding box
    positions.forEach((position, index) => {
      ctx.fillText(
        position,
        prediction.bbox[0] + prediction.bbox[2] / 2,
        prediction.bbox[1] + prediction.bbox[3] + (index + 1) * fontSize
      );
    });
  });
};

