import Brick from './Brick';

function GameBoard({
  win,
  bricks,
  calculateMove,
  rows,
  columns,
}: Readonly<{
  win: boolean;
  bricks?: IBrick[];
  calculateMove: (brick: IBrick) => void;
  rows: number;
  columns: number;
}>) {
  return (
    <div
      role="grid"
      aria-label="spelplan"
      className={`grid w-full ${rows > 5 ? 'max-w-2xl' : 'max-w-[600px] 2xl:max-w-3xl'} bg-gray gap-px my-6 md:px-20`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
      }}
    >
      {bricks
        ? bricks.map((brick) => {
            return (
              <Brick
                key={brick.value}
                brick={brick}
                win={win}
                rows={rows}
                calculateMove={calculateMove}
              />
            );
          })
        : null}
    </div>
  );
}

export default GameBoard;
