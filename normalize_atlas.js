const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const ATLAS_PATH = path.join(__dirname, 'atlas.png');
const NORMALIZED_ATLAS_PATH = path.join(__dirname, 'atlas_normalized.png');

async function normalizeAtlas() {
    try {
        // Check if the original atlas.png exists
        if (!fs.existsSync(ATLAS_PATH)) {
            console.error(`Error: Original atlas file not found at ${ATLAS_PATH}`);
            return;
        }

        console.log(`Attempting to normalize ${ATLAS_PATH} to ${NORMALIZED_ATLAS_PATH}...`);

        // Load the original atlas and save it as a new PNG
        await sharp(ATLAS_PATH)
            .png() // Ensure it's saved as PNG
            .toFile(NORMALIZED_ATLAS_PATH);

        console.log('Normalization complete. A new file has been created:');
        console.log(`  ${NORMALIZED_ATLAS_PATH}`);
        console.log('Please replace your original atlas.png with this new file, or update index.js to use atlas_normalized.png.');
        console.log('Then, run `node index.js` again.');

    } catch (error) {
        console.error(`Error during atlas normalization: ${error.message}`);
    }
}

normalizeAtlas();