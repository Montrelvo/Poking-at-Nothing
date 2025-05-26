class GridGenerator {
    /**
     * Generates a 2D grid with random tile indices.
     * @param {number} numRows - The number of rows in the grid.
     * @param {number} numCols - The number of columns in the grid.
     * @param {number} numAvailableTiles - The total number of distinct tiles available.
     * @returns {Array<Array<number>>} A 2D array representing the grid, where each element is a tile index.
     */
    generateGrid(numRows, numCols, numAvailableTiles) {
        if (numAvailableTiles <= 0) {
            throw new Error("Number of available tiles must be greater than 0.");
        }

        const grid = [];
        for (let r = 0; r < numRows; r++) {
            const row = [];
            for (let c = 0; c < numCols; c++) {
                // Randomly select a tile index from the available tiles
                const randomIndex = Math.floor(Math.random() * numAvailableTiles);
                row.push(randomIndex);
            }
            grid.push(row);
        }
        console.log(`Generated a ${numRows}x${numCols} grid with random tile assignments.`);
        return grid;
    }
}

module.exports = new GridGenerator();