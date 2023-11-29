// Import React and Material-UI
import React from "react";
import TextField from "@material-ui/core/TextField";

// Define the ObjectList component
function ObjectList(props) {
  // Get the detections array from the props
  const detections = props.detections;

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
            `${prediction.class}: ${prediction.score.toFixed(2)}\n`
        )}
        variant="outlined"
      />
    </div>
  );
}



// Export the ObjectList component
export default ObjectList;