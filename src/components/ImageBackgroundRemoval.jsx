import { useRef, useState } from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";

const ImageBackgroundRemoval = () => {
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => processImage(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const processImage = async (image) => {
    setLoading(true);

    // Load the BodyPix model
    const net = await bodyPix.load();

    // Perform segmentation with refined settings
    const segmentation = await net.segmentPerson(image, {
      internalResolution: "low", // Balance between quality and speed
      segmentationThreshold: 0.2, // Confidence threshold for segmentation
    });

    // Get the canvas context
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;

    // Draw the original image on the canvas
    ctx.drawImage(image, 0, 0);

    // Get the image data
    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixelData = imageData.data;

    // Iterate over each pixel and apply segmentation
    for (let i = 0; i < pixelData.length; i += 4) {
      const maskIndex = i / 4;

      // Remove pixels where segmentation does not detect the person
      if (!segmentation.data[maskIndex]) {
        pixelData[i] = 0; // Red
        pixelData[i + 1] = 0; // Green
        pixelData[i + 2] = 0; // Blue
        pixelData[i + 3] = 0; // Alpha (transparent)
      }
    }

    // Put the updated image data back on the canvas
    ctx.putImageData(imageData, 0, 0);

    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Background Remover</h1>
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageUpload}
      />
      {loading && <p>Processing...</p>}
      <canvas
        ref={canvasRef}
        style={{ marginTop: "20px", border: "1px solid black" }}
      />
    </div>
  );
};

export default ImageBackgroundRemoval;
