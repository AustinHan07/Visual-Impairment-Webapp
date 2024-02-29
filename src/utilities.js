import { createContext } from "react";

export const drawRect = (detections, ctx) => {
  detections.forEach((prediction) => {
    const [x, y, width, height] = prediction["bbox"];
    const text = prediction["class"];

    // Generate a random color for each object
    const color = "#" + Math.floor(Math.random()*16777215).toString(16);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.beginPath();

    // Calculate the font size based on text length
    const textLength = text.length;
    const maxSize = Math.min(width, height);
    const fontSize = (maxSize / textLength) * 2.25; // Adjust the scaling factor as needed

    ctx.font = `${fontSize}px Arial`;

    // Draw the text and the rectangle on the canvas
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

    // Get the center coordinates of the bounding box
    const x = prediction.bbox[0] + prediction.bbox[2] / 2;
    const y = prediction.bbox[1] + prediction.bbox[3] / 2;

    // Get the center coordinates of the canvas
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height;

    // Calculate the angle of the bounding box relative to the canvas center
    // Use Math.atan to get the angle in radians
    // Use Math.PI to convert radians to degrees
    let angle = Math.atan((centerY - y) / (x - centerX)) * (180 / Math.PI);

    // Initialize a variable to store the clock position
    let clockPosition = "";

    // Use a switch statement to assign the clock position based on the angle range
    switch (true) {
      case angle >= 0 && angle < 15:
        clockPosition = "3 o'clock";
        break;
      case angle >= 15 && angle < 45:
        clockPosition = "2 o'clock";
        break;
      case angle >= 45 && angle < 75:
        clockPosition = "1 o'clock";
        break;
      case (angle >= 75 && angle <= 90) || (angle >= -15 && angle <= 0):
        clockPosition = "12 o'clock";
        break;
      case angle >= -90 && angle < -75:
        clockPosition = "11 o'clock";
        break;
      case angle >= -75 && angle < -45:
        clockPosition = "10 o'clock";
        break;
      case angle >= -45 && angle < -15:
        clockPosition = "9 o'clock";
        break;
      default:
        clockPosition = "Unknown";
    }

    // Add the angle and the clock position to the prediction object
    prediction.angle = angle;
    prediction.clockPosition = clockPosition;
  });

  return detections;
};
