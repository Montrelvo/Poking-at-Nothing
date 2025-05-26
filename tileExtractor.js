const sharp = require('sharp');
const path = require('path');

const TILE_SIZE = 32; // Define tile size as a constant

class TileExtractor {
    constructor() {
        this.atlasImage = null;
        this.extractedTiles = [];
    }

    async loadAtlas(atlasPath) {
        try {
            this.atlasImage = sharp(atlasPath);
            const { data, info } = await this.atlasImage.raw().toBuffer({ resolveWithObject: true });

            const atlasWidth = info.width;
            const atlasHeight = info.height;
            const channels = info.channels; // Number of color channels (e.g., 3 for RGB, 4 for RGBA)

            if (atlasWidth % TILE_SIZE !== 0 || atlasHeight % TILE_SIZE !== 0) {
                throw new Error(`Atlas dimensions (${atlasWidth}x${atlasHeight}) are not multiples of tile size (${TILE_SIZE}).`);
            }

            const numTilesX = atlasWidth / TILE_SIZE;
            const numTilesY = atlasHeight / TILE_SIZE;

            console.log(`Loading atlas from: ${atlasPath}`);
            console.log(`Atlas dimensions: ${atlasWidth}x${atlasHeight}`);
            console.log(`Number of tiles: ${numTilesX}x${numTilesY}`);
            console.log(`Atlas channels: ${channels}`);

            this.extractedTiles = [];
            const bytesPerPixel = channels;
            const bytesPerRow = atlasWidth * bytesPerPixel;
            const tileBytesPerRow = TILE_SIZE * bytesPerPixel;

            for (let y = 0; y < numTilesY; y++) {
                for (let x = 0; x < numTilesX; x++) {
                    const tileBuffer = Buffer.alloc(TILE_SIZE * TILE_SIZE * bytesPerPixel);
                    let tileBufferIndex = 0;

                    for (let row = 0; row < TILE_SIZE; row++) {
                        const sourceRowStart = ((y * TILE_SIZE) + row) * bytesPerRow + (x * TILE_SIZE * bytesPerPixel);
                        data.copy(tileBuffer, tileBufferIndex, sourceRowStart, sourceRowStart + tileBytesPerRow);
                        tileBufferIndex += tileBytesPerRow;
                    }
                    // Convert raw buffer back to PNG using sharp
                    const tilePngBuffer = await sharp(tileBuffer, {
                        raw: {
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            channels: channels
                        }
                    }).png().toBuffer();

                    this.extractedTiles.push(tilePngBuffer);
                }
            }
            console.log(`Successfully extracted ${this.extractedTiles.length} tiles by manual pixel manipulation.`);
            return this.extractedTiles;
        } catch (error) {
            console.error(`Error loading or extracting tiles from atlas: ${error.message}`);
            throw error;
        }
    }

    getTile(index) {
        if (index < 0 || index >= this.extractedTiles.length) {
            throw new Error(`Tile index ${index} is out of bounds. Available tiles: ${this.extractedTiles.length}`);
        }
        return this.extractedTiles[index];
    }

    getTileCount() {
        return this.extractedTiles.length;
    }
}

module.exports = new TileExtractor();