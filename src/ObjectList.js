// Import React and Material-UI
import React from "react";
import TextField from "@material-ui/core/TextField";

// Define the ObjectList component
function ObjectList(props) {
  // Get the detections array from the props
  const detections = props.detections;

  // Get the canvas width and height from the props
  const canvasWidth = props.canvasWidth;
  const canvasHeight = props.canvasHeight;

  // Define a threshold for distance
  const threshold = 100;

  // Loop through the detections and compare them
  for (let i = 0; i < detections.length; i++) {
    // Get the current object
    const current = detections[i];

    // Get the center coordinates of the current object
    const currentX = current.bbox[0] + current.bbox[2] / 2;
    const currentY = current.bbox[1] + current.bbox[3] / 2;

    // Initialize an array to store the relative positions
    const positions = [];

    // Loop through the other objects
    for (let j = 0; j < detections.length; j++) {
      // Skip the current object
      if (i === j) continue;

      // Get the other object
      const other = detections[j];

      // Get the center coordinates of the other object
      const otherX = other.bbox[0] + other.bbox[2] / 2;
      const otherY = other.bbox[1] + other.bbox[3] / 2;

      // Calculate the distance between the objects
      const distance = Math.sqrt(
        (currentX - otherX) ** 2 + (currentY - otherY) ** 2
      );

      // Skip the other object if it is too far
      if (distance > threshold) continue;

      // Determine the relative position
      let position = "";

      // Check if the current object is on the left or right of the other object
      if (currentX < otherX) {
        position += "Left of ";
      } else {
        position += "Right of ";
      }

      // Check if the current object is above or below the other object
      if (currentY < otherY) {
        position += "Above ";
      } else {
        position += "Below ";
      }

      // Check if the current object is in the upper or lower half of the canvas
      if (currentY < canvasHeight / 2) {
        position += "Upper ";
      } else {
        position += "Lower ";
      }

      // Append the other object's class to the position
      position += other.class;

      // Push the position to the array
      positions.push(position);
    }

    // Add the positions to the current object
    current.positions = positions;
  }

  // Return a <div> element that renders the detections as a text box
  return (
    <div className="object-list">
      <TextField
        id="outlined-multiline-static"
        label="Objects detected"
        multiline
        rows={10}
        value={detections.map(
          (prediction) =>
            `${prediction.class}: ${prediction.score.toFixed(2)}\n${prediction.positions.join("\n")}\n`
        )}
        variant="outlined"
      />
    </div>
  );
}

// Export the ObjectList component
export default ObjectList;
