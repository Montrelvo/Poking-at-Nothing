# System Design Plan: 25x25 Tile Grid Generator (Node.js)

## 1. Information Gathering Summary:

*   **Application Type:** Node.js
*   **Output:** A 25x25 grid of randomly arranged tiles.
*   **Tile Size:** Each tile is 32x32 pixels.
*   **Tile Source:** A single master atlas PNG file.
*   **Atlas Layout:** Tiles are arranged in a regular 32x32 grid within the atlas.
*   **Master Atlas File:** `atlas.png` located in the project root directory.

## 2. Core Components:

The system will consist of the following main components:

*   **`TileExtractor` Module:** Responsible for loading the master atlas PNG and extracting individual 32x32 tile images from it.
*   **`GridGenerator` Module:** Responsible for creating the 25x25 grid structure and randomly assigning extracted tiles to each cell.
*   **`ImageComposer` Module:** Responsible for combining the individual tiles into a single output image (the 25x25 grid).
*   **`Main` Application Logic:** Orchestrates the flow, calling the other modules to achieve the final output.

## 3. Detailed Plan:

### Step 1: Project Setup and Dependencies

*   Initialize a new Node.js project (`npm init`).
*   Install necessary image processing libraries. `sharp` is recommended for performance and efficiency when dealing with image manipulation in Node.js.
    *   `npm install sharp`

### Step 2: `TileExtractor` Module (`tileExtractor.js`)

*   **Purpose:** Load the master atlas PNG and provide a way to access individual 32x32 tiles.
*   **Functionality:**
    *   A function (e.g., `loadAtlas(atlasPath)`) that takes the path to the master atlas PNG (which will be `./atlas.png`).
    *   It will use the `sharp` library to load the image.
    *   It will determine the width and height of the atlas.
    *   Calculate the number of tiles horizontally (`atlasWidth / 32`) and vertically (`atlasHeight / 32`).
    *   Iterate through the atlas, cropping each 32x32 tile. Store these individual tile buffers/data in an array (e.g., `extractedTiles`).
    *   A function (e.g., `getTile(index)`) to retrieve a specific tile by its index from the `extractedTiles` array.

### Step 3: `GridGenerator` Module (`gridGenerator.js`)

*   **Purpose:** Create the 25x25 grid structure and populate it with randomly selected tiles.
*   **Functionality:**
    *   A function (e.g., `generateGrid(numRows, numCols, availableTiles)`) that takes the desired grid dimensions (25x25) and an array of available tile data (from `TileExtractor`).
    *   It will create a 2D array representing the grid (e.g., `grid[row][col]`).
    *   For each cell in the 25x25 grid, it will randomly select one of the `availableTiles` (using `Math.random()` and `Math.floor()`) and assign it to that cell.
    *   Return the populated 2D grid array.

### Step 4: `ImageComposer` Module (`imageComposer.js`)

*   **Purpose:** Assemble the 25x25 grid of tiles into a single output PNG image.
*   **Functionality:**
    *   A function (e.g., `composeGridImage(grid, outputPath)`) that takes the populated 2D grid array (from `GridGenerator`) and the desired output file path (e.g., `./output_grid.png`).
    *   Calculate the total output image dimensions:
        *   Width: `25 * 32 = 800` pixels
        *   Height: `25 * 32 = 800` pixels
    *   Use the `sharp` library to create a new blank image of the calculated dimensions.
    *   Iterate through the `grid` array. For each tile, use `sharp`'s `composite` method to paste the individual tile buffer onto the new blank image at the correct x, y coordinates (e.g., `x = col * 32`, `y = row * 32`).
    *   Save the final composed image to the `outputPath`.

### Step 5: Main Application Logic (`index.js` or `app.js`)

*   **Purpose:** Orchestrate the entire process.
*   **Functionality:**
    *   Import the `TileExtractor`, `GridGenerator`, and `ImageComposer` modules.
    *   Define constants:
        *   `GRID_ROWS = 25`
        *   `GRID_COLS = 25`
        *   `TILE_SIZE = 32`
        *   `ATLAS_PATH = './atlas.png'`
        *   `OUTPUT_PATH = './output_grid.png'`
    *   Implement an `async` main function to handle asynchronous image operations.
    *   Call `TileExtractor.loadAtlas(ATLAS_PATH)` to get the available tiles.
    *   Call `GridGenerator.generateGrid(GRID_ROWS, GRID_COLS, availableTiles)` to create the random tile arrangement.
    *   Call `ImageComposer.composeGridImage(generatedGrid, OUTPUT_PATH)` to generate and save the final image.
    *   Include robust `try-catch` blocks for error handling and informative console logging for progress and completion.

## 4. Mermaid Diagram:

```mermaid
graph TD
    A[Start] --> B(Define Constants: Grid Size, Tile Size, Atlas Path, Output Path);
    B --> C{Load Master Atlas PNG};
    C -- Path to Atlas (./atlas.png) --> D[TileExtractor Module];
    D -- Extracted Tiles (Array of Buffers) --> E{Generate Random Grid};
    E -- Available Tiles --> F[GridGenerator Module];
    F -- Populated Grid (2D Array of Tile Buffers) --> G{Compose Final Image};
    G -- Output Path (./output_grid.png) --> H[ImageComposer Module];
    H --> I[Save Output PNG];
    I --> J[End];

    subgraph Modules
        D
        F
        H
    end