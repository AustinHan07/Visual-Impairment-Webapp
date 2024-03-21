// Import React and TensorFlow.js dependencies
import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";

// Import the ObjectList and Utilities components
import ObjectList from "./ObjectList";
import { drawRect, printObjects } from "./utilities";

function App() {
  // Create a state for the detections array
  const [detections, setDetections] = useState([]);

  // Create a ref for the webcam and the canvas elements
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Define a function to run the COCO-SSD model
  const runCoco = async () => {
    // Load the model
    const net = await cocossd.load();

    // Detect objects from the webcam stream
    const detect = async () => {
      // Check if the webcam is ready
      if (
        typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4
      ) {
        // Get the video properties
        const video = webcamRef.current.video;
        const videoWidth = webcamRef.current.video.videoWidth;
        const videoHeight = webcamRef.current.video.videoHeight;

        // Set the video and canvas dimensions
        webcamRef.current.video.width = videoWidth;
        webcamRef.current.video.height = videoHeight;
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;

        // Make detections
        const obj = await net.detect(video);

        // Draw the detections on the canvas
        const ctx = canvasRef.current.getContext("2d");

        drawRect(obj, ctx);

        // Print the detections on the canvas
        printObjects(obj, ctx); // Call the printObjects function here

        // Update the state with the detections
        setDetections(obj);
      }
    };

    // Call the detect function every 10 milliseconds
    setInterval(() => {
      detect();
    }, 10);
  };

  // Use the useEffect hook to run the COCO-SSD model once when the component mounts
  useEffect(() => {
    runCoco();
  }, []);

  const canvasWidth = 1080;
  const canvasHeight = 810;

  return (
    <div className="App">
      <header className="App-header">
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 420,
            textAlign: "center",
            zindex: 9,
            width: 1080,
            height: 810,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 420,
            textAlign: "center",
            zindex: 8,
            width: 1080,
            height: 810,
          }}
        />
        {/* Render the ObjectList component and pass the detections state as a prop */}
        <ObjectList
          detections={detections}
          canvasWidth={canvasWidth}
          canvasHeight={canvasHeight}
        />
      </header>
    </div>
  );
}

export default App;
