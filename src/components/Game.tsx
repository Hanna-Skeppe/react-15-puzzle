import { useState } from 'react';
import GameBoard from './GameBoard';
import { checkWin, createShuffledArray, updateBrickPosition } from 'src/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function Game() {
  const rows: number = Number(import.meta.env.VITE_ROWS)
    ? Number(import.meta.env.VITE_ROWS)
    : 4;
  const columns: number = Number(import.meta.env.VITE_COLUMNS)
    ? Number(import.meta.env.VITE_COLUMNS)
    : 4;
  const [bricks, setBricks] = useState(createShuffledArray(rows, columns));
  const [moveCount, setMoveCount] = useState(0);
  const [win, setWin] = useState(false);
  const [width, height] = useWindowSize();

  const shuffleBricks = () => {
    setBricks(createShuffledArray(rows, columns));
    setMoveCount(0);
    setWin(false);
  };

  const calculateMove = (brick: IBrick) => {
    let isMoveable = false;
    let axisToMove: 'x' | 'y' | null = null;
    const space = bricks.find((brick) => brick.value === 0);

    if (brick.position.x === space?.position.x) {
      isMoveable = true;
      axisToMove = 'y';
    } else if (brick.position.y === space?.position.y) {
      isMoveable = true;
      axisToMove = 'x';
    }

    if (!isMoveable) {
      return;
    }

    if (!axisToMove || !space) {
      console.error(
        'Something went wrong: Could not calculate axis to move and/or space'
      );
      return;
    }

    setMoveCount((prev) => prev + 1);
    const updatedBricks = updateBrickPosition(brick, space, axisToMove, bricks);
    setBricks(updatedBricks);

    if (checkWin(updatedBricks)) {
      setWin(true);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center">
      {win ? <Confetti width={width} height={height} /> : null}
      <div className="m-10">
        {win ? (
          <p
            aria-live="polite"
            className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl"
          >
            Grattis! Du vann med {moveCount} drag 🥳
          </p>
        ) : (
          <p className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl">
            N-pussel
          </p>
        )}
      </div>
      <GameBoard
        win={win}
        bricks={bricks}
        calculateMove={calculateMove}
        rows={rows}
        columns={columns}
      />
      <button
        className="bg-black m-6 text-white font-medium px-8 py-3 text-2xl md:text-3xl md:py-4 md:px-16"
        onClick={shuffleBricks}
      >
        Slumpa
      </button>
    </div>
  );
}

export default Game;
