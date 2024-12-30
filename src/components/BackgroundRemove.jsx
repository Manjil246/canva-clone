import React, { useRef, useState } from "react";
import { getImageLink } from "../utils/uploadTos3";
import * as fabric from "fabric";

const BackgroundRemove = ({ canvas }) => {
    const [images, setImages] = useState([]);
    const [loadingImage, setLoadingImage] = useState(false);
    const imageRef = useRef(null);

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setLoadingImage(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            // Step 1: Remove background and save processed file on the backend
            console.log("Removing background and processing image on backend...");
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/remove-background`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Failed to process image");
            }

            const data = await response.json();
            const processedFileUrl = getImageLink(data.s3_url);

            console.log(`Image processed and uploaded to S3. S3 URL: ${processedFileUrl}`);

            // Step 2: Update state with S3 URL
            setImages((prev) => [...prev, processedFileUrl]);
        } catch (error) {
            console.error("Image processing failed:", error);
            alert("Failed to process the image. Please try again.");
        } finally {
            setLoadingImage(false);
            if (imageRef.current) {
                imageRef.current.value = "";
            }
        }
    };

    const handleAddToCanvas = (imageUrl) => {
        const imageElement = document.createElement("img");

        imageElement.crossOrigin = "anonymous";
        imageElement.src = imageUrl;
        imageElement.onload = () => {
            const width = 200;
            const height =
                (imageElement.naturalHeight / imageElement.naturalWidth) * width;
            const image = new fabric.Image(imageElement, {
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

    return (
        <div className="upload-container flex flex-col gap-4">
            <label className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md cursor-pointer transition">
                {loadingImage ? "Processing..." : "Remove Background"}
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    ref={imageRef}
                />
            </label>

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

export default BackgroundRemove;
