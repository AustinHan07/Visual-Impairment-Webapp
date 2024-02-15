import React, { useState, useRef, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import "./App.css";
import ObjectList from "./ObjectList";
import { drawRect } from "./utilities";
import { printObjects } from "./utilities";

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

        //Re-order
        // Update the state with the detections
        setDetections(obj);

        // Draw the detections on the canvas
        const ctx = canvasRef.current.getContext("2d");
        drawRect(obj, ctx);
        printObjects(obj, ctx);
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

  const canvasWidth = 640;
  const canvasHeight = 480;

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
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
          }}
        />

        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
        {/* Pass the detections state to the ObjectList component */}
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
