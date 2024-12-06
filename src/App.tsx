import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as script from'./script.tsx'

// add buttons for users to randomize the board (auto pause)
// Add labels for number of generations and the population
function App() {
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [board, setBoard] = useState<boolean[][]>([]);
    const updateSpeed: number = 300; // 1000ms = 1 second
    const TILE_SIZE: number = 5;
    const [generations, setGenerations] = useState<number>(0);
    const [lives, setLives] = useState<number>(0);

/*    const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (canvas) {
            // Update Logical Board on mouse-down
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width; // DPR adjustment for X
            const scaleY = canvas.height / rect.height; // DPR adjustment for Y
            const x = (event.clientX - rect.left) * scaleX;
            const y = (event.clientY - rect.top) * scaleY;
            const row: number = Math.floor(x / TILE_SIZE);
            const col: number = Math.floor(y / TILE_SIZE);
            console.log(`Canvas clicked at: X=${x}, Y=${y}`);

            setBoard((prevBoard) => {
                const newBoard = prevBoard.map(row => [...row]);
                newBoard[row][col] = !newBoard[row][col];
                // Draw new board
                const ctx = canvas.getContext('2d');
                if (canvas && ctx) {
                    const WIDTH: number = canvas.width;
                    const HEIGHT: number = canvas.height;
                    const TILES_X: number = WIDTH / TILE_SIZE;
                    const TILES_Y: number = HEIGHT / TILE_SIZE;

                    ctx.fillStyle = "rgb(0, 0, 0)";
                    ctx.strokeStyle = "rgb(80, 80, 80)";
                    ctx.lineWidth = 1;
                    const LINE_WIDTH = ctx.lineWidth;
                    setLives(script.countLives(newBoard, TILES_X, TILES_Y));
                    script.drawBoard(prevBoard, newBoard, ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH);
                }
                return newBoard;
            });
        }
    };*/

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            const WIDTH: number = canvas.width;
            const HEIGHT: number = canvas.height;
            const TILES_X: number = WIDTH / TILE_SIZE;
            const TILES_Y: number = HEIGHT / TILE_SIZE;

            ctx.fillStyle = "rgb(0, 0, 0)";
            ctx.strokeStyle = "rgb(80, 80, 80)";
            ctx.lineWidth = 1;
            const LINE_WIDTH = ctx.lineWidth;

            const initialBoard = script.prepareBoard(TILES_X, TILES_Y);
            const randomBoard = script.generateRandomBoard(initialBoard);
            setBoard((prevBoard) => {
                console.log(prevBoard);
                script.drawBoard(initialBoard, randomBoard, ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH);
                return randomBoard;

            });
            script.drawBorder(ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH, WIDTH, HEIGHT);
        }
    }, []); // Empty dependency array means this effect runs once after initial render

    useEffect(() => {
        let lastUpdateTime: number = 0;
        let animationFrameId: number;
        // requestAnimationFrame automatically assigns a precise timestamp from the browser to the update function
        const update = (timestamp: number) => {
            if (lastUpdateTime === 0) lastUpdateTime = timestamp;

            const elapsed = timestamp - lastUpdateTime;
            if (elapsed >= updateSpeed) {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                let updatedBoard: boolean[][];
                if (canvas && ctx) {
                    const WIDTH: number = canvas.width;
                    const HEIGHT: number = canvas.height;
                    const TILES_X: number = WIDTH / TILE_SIZE;
                    const TILES_Y: number = HEIGHT / TILE_SIZE;
                    const LINE_WIDTH = ctx.lineWidth;

                    setBoard((prevBoard) => {
                        // Update Board State & Draw to Canvas every second
                        updatedBoard = script.updateBoard(prevBoard, TILES_X, TILES_Y)
                        ctx.fillStyle = "rgb(0, 0, 0)";
                        ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas before redrawing
                        script.drawBoard(prevBoard, updatedBoard, ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH);
                        // script.drawBorder(ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH, WIDTH, HEIGHT);
                        // Count Lives here
                        setLives(script.countLives(updatedBoard, TILES_X, TILES_Y));
                        return updatedBoard;
                    });
                }
                lastUpdateTime = timestamp;
                setGenerations(prevGenerations => prevGenerations + 1);
            }
            // this allows the update to loop as long as it's not paused
            if (!isPaused) {
                animationFrameId = requestAnimationFrame(update);
            }
        };

        // Initial update when the component mounts or when pause state changes to not paused
        if (!isPaused) {
            animationFrameId = requestAnimationFrame(update);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused, board]);

    return (
        <div className="game-container">
            <h1>Conway's Game of Life By FooFoo</h1>
            {/*
             < button onClick={() => setCount((count) => count + 1)}>
            count is {count}
            </button >
            */}
            <div className="gameLabelsContainer">
                <p>Generations: {generations}</p>
                <p>Lives: {lives}</p>                    
            </div>
            <div>
                <canvas
                    id="canvas"
                    ref={canvasRef}
                    width="800"
                    height="600"
                    //onMouseDown={handleMouseDown}
                />
                <button onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? 'Play' : 'Pause'}
                </button>
            </div>
        </div>
    )
}

export default App
