import { useEffect, useRef, useState } from 'react'
import './App.css'
import * as script from'./script.tsx'

// add buttons for users to randomize the board (auto pause)
// Add labels for number of generations and the population
function App() {
    const [isPaused, setIsPaused] = useState<boolean>(true);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [board, setBoard] = useState<boolean[][]>([]);
    const updateSpeed: number = 100; // 1000ms = 1 second
    const TILE_SIZE: number = 5;
    //const [generations, setGenerations]: useState<number>(0);

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
            setBoard(randomBoard);
            script.drawBoard(randomBoard, ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH);
            script.drawBorder(ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH, WIDTH, HEIGHT);             
        }
    }, []); // Empty dependency array means this effect runs once after initial render

    useEffect(() => {
        let lastUpdateTime: number = 0;
        let animationFrameId: number;
        const update = (timestamp: number) => {
            if (lastUpdateTime === 0) lastUpdateTime = timestamp;

            const elapsed = timestamp - lastUpdateTime;

            if (elapsed >= updateSpeed) {
                const canvas = canvasRef.current;
                const ctx = canvas?.getContext('2d');
                if (canvas && ctx) {
                    const WIDTH: number = canvas.width;
                    const HEIGHT: number = canvas.height;
                    const TILES_X: number = WIDTH / TILE_SIZE;
                    const TILES_Y: number = HEIGHT / TILE_SIZE;
                    const LINE_WIDTH = ctx.lineWidth;

                    setBoard((prevBoard) => {
                        // Update Board State & Draw to Canvas every second
                        const updatedBoard: boolean[][] = script.updateBoard(prevBoard, TILES_X, TILES_Y)
                        ctx.clearRect(0, 0, WIDTH, HEIGHT); // Clear the canvas before redrawing
                        script.drawBoard(updatedBoard, ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH);
                        //script.drawBorder(ctx, TILES_X, TILES_Y, TILE_SIZE, LINE_WIDTH, WIDTH, HEIGHT);
                        return updatedBoard;
                    });
                }
                lastUpdateTime = timestamp;
            }
            if (!isPaused) {
                animationFrameId = requestAnimationFrame(update);
            }
        };

        if (!isPaused) {
            animationFrameId = requestAnimationFrame(update);
        }

        return () => cancelAnimationFrame(animationFrameId);
    }, [isPaused]);

    // Placeholder usage to avoid TS6133 error
    console.log(board); 

    return (
        <>
            <h1>Conway's Game of Life By FooFoo</h1>
            {/*
             < button onClick={() => setCount((count) => count + 1)}>
            count is {count}
            </button >
            */}
            <div>
                <canvas id="canvas" ref={canvasRef} width="800" height="600"></canvas>
                <button onClick={() => setIsPaused(!isPaused)}>
                    {isPaused ? 'Play' : 'Pause'}
                </button>
            </div>
    </>
  )
}

export default App
