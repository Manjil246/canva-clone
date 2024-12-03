// const BackgroundRemoval = ({ canvas }) => {
//   console.log("canvas---", canvas);
//   const handleRemoveBackground = async () => {
//     if (!canvas) return;
//     console.log("called-----");

//     // const activeObject = canvas.getActiveObject();
//     // if (!activeObject || activeObject.type !== "image") {
//     //   alert("Please select an image to remove the background.");
//     //   return;
//     // }
//     // console.log("activeObject----", activeObject);

//     // const originalImage = activeObject.toDataURL(); // Get image data URL
//     // const processedImageURL = await removeBackground(originalImage); // Process image

//     // // Replace the old image with the background-removed image
//     // fabric.Image.fromURL(processedImageURL, (img) => {
//     //   canvas.remove(activeObject); // Remove the original image
//     //   img.scaleToWidth(activeObject.width); // Scale new image to match the original size
//     //   img.scaleToHeight(activeObject.height);
//     //   canvas.add(img);
//     //   canvas.renderAll(); // Re-render canvas
//     // });
//   };

//   //   const removeBackground = async (imageDataURL) => {
//   //     // Simulated delay; replace this with actual background removal logic
//   //     return new Promise((resolve) => {
//   //       setTimeout(() => {
//   //         // Return the original image URL as a placeholder (for real logic, this would be the processed URL)
//   //         resolve(imageDataURL);
//   //       }, 1000);
//   //     });
//   //   };
//   return (
//     <button
//       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
//       onClick={handleRemoveBackground}
//     >
//       Background removal
//     </button>
//   );
// };

// export default BackgroundRemoval;

// // import { fabric } from "fabric";

// // const BackgroundRemoval = ({ canvas }) => {
// //   // Function to remove background from the selected object on the canvas
// //   //   const handleRemoveBackground = async () => {
// //   //     if (!canvas) return;

// //   //     // Get the active object from the canvas
// //   //     const activeObject = canvas.getActiveObject();
// //   //     if (!activeObject || activeObject.type !== "image") {
// //   //       alert("Please select an image to remove the background.");
// //   //       return;
// //   //     }

// //   //     const originalImage = activeObject.toDataURL(); // Get image data URL
// //   //     const processedImageURL = await removeBackground(originalImage); // Process image

// //   //     // Replace the old image with the background-removed image
// //   //     fabric.Image.fromURL(processedImageURL, (img) => {
// //   //       canvas.remove(activeObject); // Remove the original image
// //   //       img.scaleToWidth(activeObject.width); // Scale new image to match the original size
// //   //       img.scaleToHeight(activeObject.height);
// //   //       canvas.add(img);
// //   //       canvas.renderAll(); // Re-render canvas
// //   //     });
// //   //   };

// //   // Function to simulate background removal (replace with actual logic or API call)
// //   //   const removeBackground = async (imageDataURL) => {
// //   //     // Simulated delay; replace this with actual background removal logic
// //   //     return new Promise((resolve) => {
// //   //       setTimeout(() => {
// //   //         // Return the original image URL as a placeholder (for real logic, this would be the processed URL)
// //   //         resolve(imageDataURL);
// //   //       }, 1000);
// //   //     });
// //   //   };

// //   return (
// //     <button
// //       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
// //       //   onClick={handleRemoveBackground}
// //     >
// //       Background removal
// //     </button>
// //   );
// // };

// // export default BackgroundRemoval;

// import React from "react";
// import * as bodyPix from "@tensorflow-models/body-pix";
// import "@tensorflow/tfjs";
// import * as fabric from "fabric";

// const BackgroundRemoval = ({ canvas }) => {
//   const handleRemoveBackground = async () => {
//     if (!canvas) return;

//     const activeObject = canvas.getActiveObject();
//     if (!activeObject || activeObject.type !== "image") {
//       alert("Please select an image to remove the background.");
//       return;
//     }

//     const originalImage = new Image();
//     originalImage.src = activeObject.toDataURL();

//     try {
//       const net = await bodyPix.load();
//       const segmentation = await net.segmentPerson(originalImage);

//       // Create a blank canvas to hold the processed image
//       const tempCanvas = document.createElement("canvas");
//       const tempCtx = tempCanvas.getContext("2d");
//       tempCanvas.width = originalImage.width;
//       tempCanvas.height = originalImage.height;

//       tempCtx.drawImage(originalImage, 0, 0);
//       const imageData = tempCtx.getImageData(
//         0,
//         0,
//         tempCanvas.width,
//         tempCanvas.height
//       );
//       // Process the segmentation mask
//       const { data: pixelData } = imageData;
//       for (let i = 0; i < pixelData.length; i += 4) {
//         const isPerson = segmentation.data[i / 4];
//         if (!isPerson) {
//           pixelData[i] = 0; // R
//           pixelData[i + 1] = 0; // G
//           pixelData[i + 2] = 0; // B
//           pixelData[i + 3] = 0; // A
//         }
//       }

//       tempCtx.putImageData(imageData, 0, 0);
//       const processedImageURL = tempCanvas.toDataURL();
//       console.log("1111", processedImageURL);

//       // Replace the image on the fabric canvas
//       fabric.Image.fromURL(processedImageURL, (img) => {
//         canvas.remove(activeObject); // Remove the original image
//         img.scaleToWidth(activeObject.width); // Scale new image to match the original size
//         img.scaleToHeight(activeObject.height);
//         canvas.add(img);
//         canvas.renderAll(); // Re-render canvas
//       });
//     } catch (error) {
//       console.error("Error processing background removal:", error);
//     }
//   };

//   return (
//     <button
//       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
//       onClick={handleRemoveBackground}
//     >
//       Background removal
//     </button>
//   );
// };

// export default BackgroundRemoval;

// import React from "react";
// import * as bodyPix from "@tensorflow-models/body-pix";
// import "@tensorflow/tfjs";
// import { fabric } from "fabric";

// const BackgroundRemoval = ({ canvas }) => {
//   const handleRemoveBackground = async () => {
//     if (!canvas) return;

//     const activeObject = canvas.getActiveObject();
//     if (!activeObject || activeObject.type !== "image") {
//       alert("Please select an image to remove the background.");
//       return;
//     }

//     const originalImage = new Image();
//     originalImage.src = activeObject.toDataURL(); // Get the base64 of the selected image

//     originalImage.onload = async () => {
//       try {
//         const net = await bodyPix.load();
//         const segmentation = await net.segmentPerson(originalImage);

//         // Create a temporary canvas
//         const tempCanvas = document.createElement("canvas");
//         tempCanvas.width = originalImage.width;
//         tempCanvas.height = originalImage.height;
//         const tempCtx = tempCanvas.getContext("2d");

//         // Draw the original image
//         tempCtx.drawImage(originalImage, 0, 0);

//         // Get the image data
//         const imageData = tempCtx.getImageData(
//           0,
//           0,
//           tempCanvas.width,
//           tempCanvas.height
//         );

//         // Modify the image data to remove the background
//         const { data: pixelData } = imageData;
//         for (let i = 0; i < pixelData.length; i += 4) {
//           const isPerson = segmentation.data[i / 4];
//           if (!isPerson) {
//             // Set pixel to transparent
//             pixelData[i] = 0; // Red
//             pixelData[i + 1] = 0; // Green
//             pixelData[i + 2] = 0; // Blue
//             pixelData[i + 3] = 0; // Alpha
//           }
//         }

//         // Put the modified data back into the canvas
//         tempCtx.putImageData(imageData, 0, 0);

//         // Get the resulting image as a base64 URL
//         const processedImageURL = tempCanvas.toDataURL();

//         // Replace the old image on the Fabric.js canvas
//         fabric.Image.fromURL(processedImageURL, (img) => {
//           canvas.remove(activeObject); // Remove the original image
//           img.scaleToWidth(activeObject.width); // Scale new image to match the original size
//           img.scaleToHeight(activeObject.height);
//           canvas.add(img);
//           canvas.renderAll(); // Re-render the canvas
//         });
//       } catch (error) {
//         console.error("Error removing background:", error);
//       }
//     };
//   };

//   return (
//     <button
//       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
//       onClick={handleRemoveBackground}
//     >
//       Remove Background
//     </button>
//   );
// };

// export default BackgroundRemoval;

// import React from "react";
// import * as bodyPix from "@tensorflow-models/body-pix";
// import "@tensorflow/tfjs";
// import * as fabric from "fabric";

// // import { fabric } from "fabric";

// const BackgroundRemoval = ({ canvas }) => {
//   const handleRemoveBackground = async () => {
//     if (!canvas) return;

//     const activeObject = canvas.getActiveObject();
//     if (!activeObject || activeObject.type !== "image") {
//       alert("Please select an image to remove the background.");
//       return;
//     }

//     const originalImage = new Image();
//     originalImage.src = activeObject.toDataURL(); // Get the base64 of the selected image

//     originalImage.onload = async () => {
//       try {
//         const net = await bodyPix.load();
//         const segmentation = await net.segmentPerson(originalImage);
//         console.log("segmentation---", segmentation);

//         // Create a temporary canvas
//         const tempCanvas = document.createElement("canvas");
//         tempCanvas.width = originalImage.width;
//         tempCanvas.height = originalImage.height;
//         const tempCtx = tempCanvas.getContext("2d");

//         // Draw the original image
//         tempCtx.drawImage(originalImage, 0, 0);

//         // Get the image data
//         const imageData = tempCtx.getImageData(
//           0,
//           0,
//           tempCanvas.width,
//           tempCanvas.height
//         );

//         // Modify the image data to remove the background
//         const { data: pixelData } = imageData;
//         for (let i = 0; i < pixelData.length; i += 4) {
//           const isPerson = segmentation.data[i / 4];
//           if (!isPerson) {
//             // Set pixel to transparent
//             pixelData[i] = 0; // Red
//             pixelData[i + 1] = 0; // Green
//             pixelData[i + 2] = 0; // Blue
//             pixelData[i + 3] = 0; // Alpha
//           }
//         }

//         // Put the modified data back into the canvas
//         tempCtx.putImageData(imageData, 0, 0);

//         // Get the resulting image as a base64 URL
//         const processedImageURL = tempCanvas.toDataURL();
//         console.log("processedImageURL---", processedImageURL);

//         // Replace the old image on the Fabric.js canvas
//         fabric.Image.fromURL(processedImageURL, (img) => {
//           canvas.remove(activeObject); // Remove the original image
//           img.scaleToWidth(activeObject.width); // Scale new image to match the original size
//           img.scaleToHeight(activeObject.height);
//           canvas.add(img);
//           canvas.renderAll(); // Re-render the canvas
//         });
//       } catch (error) {
//         console.error("Error removing background:", error);
//       }
//     };
//   };

//   return (
//     <button
//       className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
//       onClick={handleRemoveBackground}
//     >
//       Remove Background
//     </button>
//   );
// };

// export default BackgroundRemoval;

import React from "react";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
// import { fabric } from "fabric";
import * as fabric from "fabric";

const BackgroundRemoval = ({ canvas }) => {
  const handleRemoveBackground = async () => {
    if (!canvas) return;

    const activeObject = canvas.getActiveObject();
    if (!activeObject || activeObject.type !== "image") {
      alert("Please select an image to remove the background.");
      return;
    }

    const originalImage = new Image();
    originalImage.src = activeObject.toDataURL(); // Get the base64 of the selected image

    originalImage.onload = async () => {
      try {
        const net = await bodyPix.load();

        // Use higher segmentation resolution and refined settings
        const segmentation = await net.segmentPerson(originalImage, {
          flipHorizontal: false,
          internalResolution: "high", // Use "high" for better quality masks
          segmentationThreshold: 0.7, // Adjust threshold for including more body parts
        });

        // Create a temporary canvas
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalImage.width;
        tempCanvas.height = originalImage.height;
        const tempCtx = tempCanvas.getContext("2d");

        // Draw the original image
        tempCtx.drawImage(originalImage, 0, 0);

        // Get the image data
        const imageData = tempCtx.getImageData(
          0,
          0,
          tempCanvas.width,
          tempCanvas.height
        );

        // Modify the image data to remove the background
        const { data: pixelData } = imageData;
        for (let i = 0; i < pixelData.length; i += 4) {
          const isPerson = segmentation.data[i / 4];
          if (!isPerson) {
            // Set pixel to transparent
            pixelData[i] = 0; // Red
            pixelData[i + 1] = 0; // Green
            pixelData[i + 2] = 0; // Blue
            pixelData[i + 3] = 0; // Alpha
          }
        }

        // Put the modified data back into the canvas
        tempCtx.putImageData(imageData, 0, 0);

        const mask = bodyPix.toMask(segmentation);
        tempCtx.putImageData(mask, 0, 0);

        // Get the resulting image as a base64 URL
        const processedImageURL = tempCanvas.toDataURL();
        console.log("processedImageURL----", processedImageURL);
        // Replace the old image on the Fabric.js canvas
        fabric.Image.fromURL(processedImageURL, (img) => {
          canvas.remove(activeObject); // Remove the original image
          img.scaleToWidth(activeObject.width); // Scale new image to match the original size
          img.scaleToHeight(activeObject.height);
          canvas.add(img);
          canvas.renderAll(); // Re-render the canvas
        });
      } catch (error) {
        console.error("Error removing background:", error);
      }
    };
  };

  return (
    <button
      className="p-2 mt-2 bg-green-500 text-white rounded hover:bg-green-700"
      onClick={handleRemoveBackground}
    >
      Remove Background
    </button>
  );
};

export default BackgroundRemoval;
