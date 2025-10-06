// Synthestry Server (index.js)
const express = require('express');
const cors = require('cors');
const sharp = require('sharp');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow cross-origin requests
app.use(express.json()); // Allow server to read JSON from requests

// Initialize the Google Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The prompt template
const createPrompt = (frame, totalFrames, gender, age, region) => {
  const percentage = Math.round((frame / (totalFrames -1)) * 100);
  let basePrompt = `
    Ultra-photorealistic portrait of a human face, looking directly at the camera, neutral expression.
    Style: Cinematic, 4K, soft studio lighting, neutral gray background.
    Subject: A ${gender}, ${age} person.
  `;
  if (frame === 0) {
    return `${basePrompt} The person has ambiguous, mixed-ethnicity features. This is the neutral starting point.`;
  } else {
    return `${basePrompt} This person is transitioning towards a ${region} heritage. This image represents a ${percentage}% completion of that transition.`;
  }
};

// The main endpoint for image generation
app.post('/generate-image', async (req, res) => {
  try {
    const { gender, age, region } = req.body;
    const model = genAI.getGenerativeModel({ model: "imagen-2-flash" });

    console.log(`Starting generation for: ${gender}, ${age}, ${region}`);

    // 1. Generate 4 images in parallel
    const imagePromises = [];
    for (let i = 0; i < 4; i++) {
        const prompt = createPrompt(i, 4, gender, age, region);
        imagePromises.push(model.generateImage({ prompt }));
    }
    const imageResults = await Promise.all(imagePromises);
    const imageBuffers = imageResults.map(result => result.image);

    console.log("All 4 images generated. Now stitching...");

    // 2. Stitch the images together using Sharp
    const imageDimensions = await sharp(imageBuffers[0]).metadata();
    const width = imageDimensions.width;
    const height = imageDimensions.height;
    
    const stitchedImageBuffer = await sharp({
        create: {
            width: width * 4,
            height: height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    })
    .composite([
        { input: imageBuffers[0], left: width * 0, top: 0 },
        { input: imageBuffers[1], left: width * 1, top: 0 },
        { input: imageBuffers[2], left: width * 2, top: 0 },
        { input: imageBuffers[3], left: width * 3, top: 0 },
    ])
    .png()
    .toBuffer();

    console.log("Stitching complete. Sending image back to client.");

    // 3. Send the final image back as a Base64 Data URI
    const imageDataURI = `data:image/png;base64,${stitchedImageBuffer.toString('base64')}`;
    res.json({ imageData: imageDataURI });

  } catch (error) {
    console.error("Error during image generation:", error);
    res.status(500).json({ error: "Failed to generate image." });
  }
});

app.listen(port, () => {
  console.log(`Synthestry server listening on port ${port}`);
});
