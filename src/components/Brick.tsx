import { IBrick } from 'src/types/types';
import { isMoveable } from 'src/utils';

function Brick({
  win,
  brick,
  space,
  rows,
  calculateMove,
}: Readonly<{
  win: boolean;
  brick: IBrick;
  space?: IBrick;
  rows: number;
  calculateMove: (brick: IBrick) => void;
}>) {
  if (!brick) return null;
  const moveableText =
    !!space && isMoveable(brick, space) ? 'Kan flyttas' : 'Kan inte flyttas';
  if (brick.value === 0) {
    return (
      <div
        aria-hidden="true"
        className="aspect-square w-full h-full bg-transparent"
      />
    );
  }
  return (
    <button
      aria-label={`${brick.value}, rad ${brick.position.x + 1}, kolumn ${brick.position.y + 1}. ${moveableText}`}
      disabled={win}
      onClick={() => calculateMove(brick)}
      className={`
        ${rows > 5 ? 'text-lg xs:text-2xl sm:text-4xl md:text-3xl ' : 'text-3xl sm:text-4xl md:text-4xl 2xl:text-5xl '} 
        font-semibold aspect-square bg-blue border border-black text-black rounded-md w-full h-full focus-visible:bg-yellow-300  focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-black`}
    >
      {brick.value}
    </button>
  );
}

export default Brick;
