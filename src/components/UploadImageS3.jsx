import React, { useRef, useState } from "react";
import { uploadImage, getKeyForS3DesignerPage } from "../utils/uploadTos3";
import * as fabric from "fabric";

const UploadImageS3 = ({ canvas, canvasesRef, activePage }) => {
  const [images, setImages] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];

    if (file) {
      setLoadingImage(true);

      try {
        const fileName = file.name;
        const key = getKeyForS3DesignerPage(fileName);
        const res = await uploadImage(key, file);

        setImages((prev) => [
          ...prev,
          import.meta.env.VITE_CLOUD_FRONT_URL + res.key,
        ]);
        setLoadingImage(false);
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Failed to upload the image. Please try again.");
        setLoadingImage(false);
      }
    }

    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  // const handleAddToCanvas = (imageUrl) => {
  //   const context = canvas.getContext("2d");
  //   const img = new Image();
  //   img.src = imageUrl;

  //   img.onload = () => {
  //     context.drawImage(img, 0, 0, canvas.width, canvas.height);
  //   };
  // };

  const handleAddToCanvas = (imageUrl) => {
    console.log(imageUrl);
    const imageElement = document.createElement("img");

    imageElement.crossOrigin = "anonymous";
    imageElement.src = imageUrl;
    imageElement.onload = () => {
      const width = 200;
      const height =
        (imageElement.naturalHeight / imageElement.naturalWidth) * width;
      let image = new fabric.Image(imageElement, {
        left: 200,
        top: 200,
        originX: "center",
        originY: "center",
      });
      image.set({
        scaleX: width / imageElement.naturalWidth,
        scaleY: height / imageElement.naturalHeight,
      });
      canvas.add(image);
      canvas.centerObject(image);
      canvas.setActiveObject(image);
      canvas.renderAll();
    };
    imageElement.onerror = () => {
      console.error("Failed to load image:");
    };
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);

    const activeCanvas = canvasesRef.current[activePage];
    if (!activeCanvas) return;

    const imageUrl = event.dataTransfer.getData("image-url");
    if (imageUrl) {
      const imgElement = document.createElement("img");
      imgElement.crossOrigin = "anonymous";
      imgElement.src = imageUrl;

      imgElement.onload = () => {
        const fabricImage = new fabric.Image(imgElement, {
          left: activeCanvas.width / 2,
          top: activeCanvas.height / 2,
          originX: "center",
          originY: "center",
          scaleX: 0.5,
          scaleY: 0.5,
        });

        activeCanvas.add(fabricImage);
        activeCanvas.setActiveObject(fabricImage);
        activeCanvas.renderAll();
      };
    }
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
    <div
      className={`upload-container flex flex-col gap-4 ${
        isDragging ? "border-dashed border-2 border-blue-600" : ""
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
    >
      {/* Upload Button */}
      <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md cursor-pointer transition">
        {loadingImage ? "Uploading..." : "Upload Image"}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageUpload}
          ref={imageRef}
          // multiple
        />
      </label>

      {/* Uploaded Images */}
      <div className="flex flex-wrap gap-4 h-[300px] overflow-y-scroll scroller">
        {images.map((imageUrl, index) => (
          <div
            key={index}
            draggable
            className="relative w-32 h-32 border border-gray-300 rounded shadow-md"
            onDragStart={(e) => e.dataTransfer.setData("image-url", imageUrl)}
            onClick={() => handleAddToCanvas(imageUrl)}
          >
            <img
              src={imageUrl}
              alt="Uploaded"
              className="w-full h-full object-cover rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadImageS3;
