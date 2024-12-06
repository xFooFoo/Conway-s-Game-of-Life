export function script() {
  return (
    <p>Hello world!</p>
  );
}


// Draws the grid on the canvas
// Redrawing the borders each generation was slowing the whole program down a lot
export const drawBorder = (
    ctx: CanvasRenderingContext2D,
    TILES_X: number,
    TILES_Y: number,
    TILE_SIZE: number,
    LINE_WIDTH: number,
    width: number,
    height: number
) => {
    // Drawing Horizontal Lines
    for (let i = 0; i < TILES_X; i++) {
        ctx.moveTo(i * TILE_SIZE - LINE_WIDTH / 2, 0);
        ctx.lineTo(i * TILE_SIZE - LINE_WIDTH / 2, height);
        ctx.stroke();
    }// Drawing Vertical Lines
    for (let j = 0; j < TILES_Y; j++) {
        ctx.moveTo(0, j * TILE_SIZE - LINE_WIDTH / 2);
        ctx.lineTo(width, j * TILE_SIZE - LINE_WIDTH / 2);
        ctx.stroke();
    }
}

// Handles mouse-click events on the canvas
/*export const handleCanvasClick = (canvas: HTMLCanvasElement, event: React.MouseEvent<HTMLCanvasElement>) => {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
            const x : number = event.clientX;
            const y : number = event.clientY;
            //console.log(`Canvas clicked at: ${x}, ${y}`);
            // Perform any drawing or other logic here
            // ctx.MoveTo ...
        }
    }
};*/

// Generates a default board with nothing alive
export const prepareBoard = (TILES_X: number = 20, TILES_Y: number = 20): boolean[][] => {
    const board: boolean[][] = [];
    for (let i = 0; i < TILES_X; i++) {
        const row: boolean[] = [];
        for (let j = 0; j < TILES_Y; j++) {
            row.push(false);
        }
        board.push(row);
    }
    return board;
}

// Generates a random board by adjusting status
// maybe i can add a probability variable and let user adjust
export const generateRandomBoard = (board: boolean[][]): boolean[][] => {
    const TILES_X : number = board.length;
    const TILES_Y : number = board[0].length;
    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            // Adjust the probability here to spawn more/less initial lives
            if (Math.random() < 0.5) {
                board[i][j] = true;
                //console.log(`Board pushed true`);
            } // otherwise it's left at default value of false
        }
    }
    return board;
}

// This function updates the board based on the Game of life rules
export const updateBoard = (oldBoard: boolean[][], TILES_X: number = 20, TILES_Y: number = 20): boolean[][] => {
    const newBoard: boolean[][] = oldBoard.map(row => row.slice());

    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            const aliveNeighbours: number = checkNeighbours(oldBoard, i, j, TILES_X, TILES_Y);
            //console.log(`Cell at (${i}, ${j}) has ${aliveNeighbours} neighbors.`);
            // checks the number of alive neighbours
            switch (aliveNeighbours) {
                case 0:
                case 1:
                // Underpopulation - same as the default case
                    newBoard[i][j] = false;
                    break;
                case 2:
                // Do nothing, if something's alive it lives on
                    break;
                case 3:
                // Reproduction
                    newBoard[i][j] = true;
                    break;
                default:
                // Overpopulation
                    newBoard[i][j] = false;
                    break;
            }
        }
    }
    return newBoard;
}


export const checkNeighbours = (
    oldBoard: boolean[][],
    currentRow: number,
    currentColumn: number,
    TILES_X: number = 20,
    TILES_Y: number = 20
): number => {
    let aliveNeighbours: number = 0;

    for (let i = currentRow - 1; i <= currentRow + 1; i++) {
        for (let j = currentColumn - 1; j <= currentColumn + 1; j++) {
            // Do not count itself as a neighbour
            if (i === currentRow && j === currentColumn) {
                continue;
            }
            // checks for index out of bounds
            if (i >= 0 && i < TILES_X && j >= 0 && j < TILES_Y) {
                // checks if the neighbour is alive
                if (oldBoard[i][j]) {
                    aliveNeighbours++;
                }
            }
        }
    }
    return aliveNeighbours;
}

export const drawBoard = (
    prevBoard: boolean[][],
    newBoard: boolean[][],
    ctx: CanvasRenderingContext2D,
    TILES_X: number,
    TILES_Y: number,
    TILE_SIZE: number,
    LINE_WIDTH: number
) => {
    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            // Only update changed cells
            if (newBoard[i][j] !== prevBoard[i][j]) {
                // Cell's Alive, green fill
                if (newBoard[i][j]) {
                    ctx.fillStyle = "rgb(0, 255, 0)";
                }
                // Cell's Dead, black fill
                else {
                    ctx.fillStyle = "rgb(0, 0, 0)";
                }
                ctx.fillRect(
                    i * TILE_SIZE + LINE_WIDTH / 2,
                    j * TILE_SIZE + LINE_WIDTH / 2,
                    TILE_SIZE - LINE_WIDTH,
                    TILE_SIZE - LINE_WIDTH
                );
            }
        }
    }
}

export const countLives = (
    board: boolean[][],
    TILES_X: number,
    TILES_Y: number
) => {
    let lives: number = 0;

    for (let i = 0; i < TILES_X; i++) {
        for (let j = 0; j < TILES_Y; j++) {
            if (board[i][j]) {
                lives++;
            }
        } 
    }
    return lives
}