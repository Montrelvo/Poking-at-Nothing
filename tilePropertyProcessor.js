const fs = require('fs').promises;
const path = require('path');
const tileExtractor = require('./tileExtractor'); // Re-use the existing tileExtractor

class TilePropertyProcessor {
    /**
     * Processes raw tile data, validates it against the atlas, and exports it to a JSON file.
     * @param {string} rawTileDataPath - Path to the user-defined raw tile data JSON file.
     * @param {string} atlasPath - Path to the atlas PNG file.
     * @param {string} outputPath - Path where the processed tile properties JSON will be saved.
     */
    async processTileData(rawTileDataPath, atlasPath, outputPath) {
        try {
            console.log(`Processing raw tile data from: ${rawTileDataPath}`);

            // 1. Get total number of tiles from the atlas
            const extractedTiles = await tileExtractor.loadAtlas(atlasPath);
            const numTilesInAtlas = tileExtractor.getTileCount();
            console.log(`Detected ${numTilesInAtlas} tiles in the atlas.`);

            // 2. Read raw tile data provided by the user
            const rawDataContent = await fs.readFile(rawTileDataPath, 'utf8');
            const rawTileData = JSON.parse(rawDataContent);

            if (!Array.isArray(rawTileData)) {
                throw new Error(`Raw tile data file '${rawTileDataPath}' must contain a JSON array.`);
            }

            // 3. Validate against atlas tile count
            if (rawTileData.length !== numTilesInAtlas) {
                throw new Error(`Mismatch: Raw tile data contains ${rawTileData.length} entries, but atlas has ${numTilesInAtlas} tiles. Please ensure they match.`);
            }

            // 4. Validate individual tile entries and prepare for export
            const processedTileData = rawTileData.map((tile, index) => {
                if (typeof tile !== 'object' || tile === null) {
                    throw new Error(`Tile entry at index ${index} is not a valid object.`);
                }
                if (typeof tile.type !== 'string' || tile.type.trim() === '') {
                    throw new Error(`Tile entry at index ${index} is missing or has an invalid 'type' property.`);
                }
                if (typeof tile.adjacency !== 'object' || tile.adjacency === null) {
                    throw new Error(`Tile entry at index ${index} is missing or has an invalid 'adjacency' property.`);
                }
                // Basic validation for adjacency directions
                const directions = ['north', 'east', 'south', 'west'];
                for (const dir of directions) {
                    if (tile.adjacency[dir] && !Array.isArray(tile.adjacency[dir])) {
                        throw new Error(`Adjacency rule for direction '${dir}' at tile index ${index} is not an array.`);
                    }
                }
                return {
                    index: index, // Add index for clarity in the final JSON
                    type: tile.type,
                    adjacency: tile.adjacency
                };
            });

            // 5. Write the processed data to the output JSON file
            await fs.writeFile(outputPath, JSON.stringify(processedTileData, null, 2), 'utf8');
            console.log(`Successfully exported tile properties to: ${outputPath}`);

        } catch (error) {
            console.error(`Error in TilePropertyProcessor: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new TilePropertyProcessor();