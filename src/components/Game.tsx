import { useState, useEffect, useRef } from 'react';
import GameBoard from './GameBoard';
import {
  checkWin,
  createShuffledArray,
  updateBrickPosition,
  isMoveable,
} from 'src/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { IBrick } from 'src/types/types';
import { BOARD_SIZES } from 'src/constants';

function Game() {
  const [size, setSize] = useState({
    rows: Number(import.meta.env.VITE_DEFAULT_ROWS) || BOARD_SIZES[2].rows,
    columns:
      Number(import.meta.env.VITE_DEFAULT_COLUMNS) || BOARD_SIZES[2].columns,
  });
  const [bricks, setBricks] = useState(() =>
    createShuffledArray(size.rows, size.columns)
  );
  const [moveCount, setMoveCount] = useState(0);
  const [win, setWin] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [width, height] = useWindowSize();
  const space = bricks.find((b) => b.value === 0);

  const startNewGame = (rows: number, columns: number) => {
    setBricks(createShuffledArray(rows, columns));
    setMoveCount(0);
    setWin(false);
    setAnnouncement(`Nytt spel, ${rows} × ${columns}.`);
  };

  const changeSize = (value: string) => {
    const [rows, columns] = value.split('x').map(Number);
    setSize({ rows, columns });
    startNewGame(rows, columns);
  };

  const calculateMove = (brick: IBrick) => {
    if (!space || !isMoveable(brick, space)) return;

    const axisToMove = brick.position.x === space.position.x ? 'y' : 'x';

    setMoveCount((prev) => prev + 1);

    const updatedBricks = updateBrickPosition(brick, space, axisToMove, bricks);
    setBricks(updatedBricks);

    if (checkWin(updatedBricks)) {
      setWin(true);
      setAnnouncement(`Grattis! Du vann med ${moveCount + 1} drag`);
    } else {
      setAnnouncement(
        `${brick.value} flyttad. Tom ruta på rad ${brick.position.x + 1}, kolumn ${brick.position.y + 1}.`
      );
    }
  };

  const shuffleButtonRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (win) shuffleButtonRef.current?.focus();
  }, [win]);

  return (
    <div className="flex flex-col justify-center items-center">
      {win ? <Confetti width={width} height={height} /> : null}
      <div className="m-10">
        <p className="text-black font-semibold text-2xl sm:text-3xl md:text-4xl">
          {win ? `Grattis! Du vann med ${moveCount} drag 🥳` : 'N-pussel'}
        </p>

        <p aria-live="polite" className="sr-only">
          {announcement}
        </p>
      </div>
      <div className="flex flex-col font-semibold gap-2 mb-2">
        <label htmlFor="board-size">Välj storlek på spelplanen</label>
        <select
          className="bg-inherit border border-black text-black rounded-md px-2 py-1 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-black"
          id="board-size"
          value={`${size.rows}x${size.columns}`}
          onChange={(e) => changeSize(e.target.value)}
        >
          {BOARD_SIZES.map(({ rows, columns }) => (
            <option key={`${rows}x${columns}`} value={`${rows}x${columns}`}>
              {rows} × {columns} rutor
            </option>
          ))}
        </select>
      </div>
      <GameBoard
        win={win}
        bricks={bricks}
        space={space}
        calculateMove={calculateMove}
        rows={size.rows}
        columns={size.columns}
      />
      <button
        ref={shuffleButtonRef}
        className="bg-black m-6 text-white font-medium px-8 py-3 text-2xl rounded-md md:text-3xl md:py-4 md:px-16 focus-visible:bg-yellow-300 focus-visible:text-black focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-black"
        onClick={() => startNewGame(size.rows, size.columns)}
      >
        Slumpa
      </button>
    </div>
  );
}

export default Game;
