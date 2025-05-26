const sharp = require('sharp');

const TILE_SIZE = 32; // Ensure TILE_SIZE is consistent

class ImageComposer {
    /**
     * Composes a single image from a 2D grid of tile buffers.
     * @param {Array<Array<Buffer>>} grid - A 2D array where each element is a tile buffer.
     * @param {string} outputPath - The path where the final composed image will be saved.
     */
    async composeGridImage(grid, outputPath) {
        if (!grid || grid.length === 0 || grid[0].length === 0) {
            throw new Error("Grid is empty or invalid.");
        }

        const numRows = grid.length;
        const numCols = grid[0].length;

        const outputWidth = numCols * TILE_SIZE;
        const outputHeight = numRows * TILE_SIZE;

        console.log(`Composing image of dimensions: ${outputWidth}x${outputHeight}`);

        const compositeOperations = [];
        for (let r = 0; r < numRows; r++) {
            for (let c = 0; c < numCols; c++) {
                const tileBuffer = grid[r][c];
                if (!tileBuffer) {
                    console.warn(`Missing tile at grid position [${r}][${c}]. Skipping.`);
                    continue;
                }
                compositeOperations.push({
                    input: tileBuffer,
                    left: c * TILE_SIZE,
                    top: r * TILE_SIZE
                });
            }
        }

        try {
            await sharp({
                    create: {
                        width: outputWidth,
                        height: outputHeight,
                        channels: 4, // RGBA
                        background: { r: 0, g: 0, b: 0, alpha: 0 } // Transparent background
                    }
                })
                .composite(compositeOperations)
                .toFile(outputPath);
            console.log(`Successfully composed grid image to: ${outputPath}`);
        } catch (error) {
            console.error(`Error composing image: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new ImageComposer();