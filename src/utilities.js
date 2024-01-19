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

    // Get the center coordinates of the bounding box
    const x = prediction.bbox[0] + prediction.bbox[2] / 2;
    const y = prediction.bbox[1] + prediction.bbox[3] / 2;

    // Get the center coordinates of the canvas
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height;

    // Calculate the angle of the bounding box relative to the canvas center
    // Use Math.atan to get the angle in radians
    // Use Math.PI to convert radians to degrees
    let angle = Math.atan((centerY - y) / x) * (180 / Math.PI);

    // Handle the special cases when x is zero or negative
    if (x === 0) {
      // If x is zero, the angle is either 90 or -90 degrees
      angle = y > centerY ? 90 : -90;
    } else if (x < 0) {
      // If x is negative, the angle is either 180 or -180 degrees
      angle = y > centerY ? 180 : -180;
    }

    // Initialize a variable to store the clock position
    let clockPosition = "";

    // Use a switch statement to assign the clock position based on the angle range
    switch (true) {
      case angle >= 0 && angle < 30:
        clockPosition = "12 o'clock";
        break;
      case angle >= 30 && angle < 60:
        clockPosition = "11 o'clock";
        break;
      case angle >= 60 && angle < 90:
        clockPosition = "10 o'clock";
        break;
      case angle >= 90 && angle < 120:
        clockPosition = "1 o'clock";
        break;
      case angle >= 120 && angle < 150:
        clockPosition = "2 o'clock";
        break;
      case angle >= 150 && angle < 180:
        clockPosition = "9 o'clock";
        break;
      default:
        clockPosition = "Unknown";
    }

    // Print the clock position below the positions
    ctx.fillText(
      clockPosition,
      prediction.bbox[0] + prediction.bbox[2] / 2,
      prediction.bbox[1] + prediction.bbox[3] + (positions.length + 1) * fontSize
    );

    // Add the clock position to the prediction object
    prediction.clockPosition = clockPosition;
  });
};
