const tilePropertyProcessor = require('./tilePropertyProcessor');
const path = require('path');
const fs = require('fs').promises;

// Define constants for file paths
const RAW_TILE_DATA_PATH = path.join(__dirname, 'raw_tile_data.json');
const ATLAS_PATH = path.join(__dirname, 'atlas.png'); // Assumes atlas.png is in the root
const PROCESSED_TILE_PROPERTIES_PATH = path.join(__dirname, 'tile_properties.json');

async function defineTileProperties() {
    try {
        console.log('Starting tile property definition and export process...');

        // Check if raw_tile_data.json exists
        try {
            await fs.access(RAW_TILE_DATA_PATH, fs.constants.F_OK);
        } catch (err) {
            console.error(`Error: The raw tile data file '${RAW_TILE_DATA_PATH}' does not exist.`);
            console.error('Please create this file with your tile type and adjacency definitions.');
            console.error('Refer to the System_Design_Plan.md for the expected format.');
            process.exit(1);
        }

        // Check if atlas.png exists
        try {
            await fs.access(ATLAS_PATH, fs.constants.F_OK);
        } catch (err) {
            console.error(`Error: The atlas file '${ATLAS_PATH}' does not exist.`);
            console.error('Please ensure you have an atlas.png file in the project root directory.');
            process.exit(1);
        }

        await tilePropertyProcessor.processTileData(
            RAW_TILE_DATA_PATH,
            ATLAS_PATH,
            PROCESSED_TILE_PROPERTIES_PATH
        );

        console.log('Tile property definition and export completed successfully!');
        console.log(`Processed tile properties saved to: ${PROCESSED_TILE_PROPERTIES_PATH}`);

    } catch (error) {
        console.error('An error occurred during the tile property definition process:');
        console.error(error);
        process.exit(1);
    }
}

defineTileProperties();