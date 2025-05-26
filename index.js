const tileExtractor = require('./tileExtractor');
const gridGenerator = require('./gridGenerator');
const imageComposer = require('./imageComposer');
const path = require('path');
const fs = require('fs');

// Define constants
const GRID_ROWS = 25;
const GRID_COLS = 25;
const TILE_SIZE = 32; // This constant is also used in tileExtractor and imageComposer
const ATLAS_PATH = path.join(__dirname, 'atlas.png'); // Assumes atlas.png is in the root
const OUTPUT_PATH = path.join(__dirname, 'output_grid.png');

async function main() {
    try {
        console.log('Starting tile grid generation process...');

        // Step 1: Extract tiles from the atlas
        const extractedTileBuffers = await tileExtractor.loadAtlas(ATLAS_PATH);
        const numAvailableTiles = tileExtractor.getTileCount();

        if (numAvailableTiles === 0) {
            throw new Error("No tiles were extracted from the atlas. Please ensure 'atlas.png' exists and contains valid tiles.");
        }

        // Step 2: Generate the grid with random tile indices
        const gridIndices = gridGenerator.generateGrid(GRID_ROWS, GRID_COLS, numAvailableTiles);

        // Step 3: Map grid indices to actual tile buffers
        const gridWithBuffers = gridIndices.map(row =>
            row.map(index => tileExtractor.getTile(index))
        );

        // Step 4: Compose the final image
        await imageComposer.composeGridImage(gridWithBuffers, OUTPUT_PATH);

        console.log('Tile grid generation completed successfully!');
        console.log(`Output image saved to: ${OUTPUT_PATH}`);

    } catch (error) {
        console.error('An error occurred during the tile grid generation process:');
        console.error(error);
        process.exit(1); // Exit with a non-zero code to indicate an error
    }
}

// Check if atlas.png exists before running the main function
fs.access(ATLAS_PATH, fs.constants.F_OK, (err) => {
    if (err) {
        console.error(`Error: The atlas file '${ATLAS_PATH}' does not exist.`);
        console.error('Please ensure you have an atlas.png file in the project root directory.');
        process.exit(1);
    } else {
        main();
    }
});