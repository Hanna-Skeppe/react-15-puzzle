function Brick({
  win,
  brick,
  rows,
  calculateMove,
}: Readonly<{
  win: boolean;
  brick: IBrick;
  rows: number;
  calculateMove: (brick: IBrick) => void;
}>) {
  if (!brick) return null;
  if (brick.value === 0) {
    return (
      <div
        aria-label="tom ruta"
        className="aspect-square w-full h-full bg-transparent"
      >
        <span
          aria-rowindex={brick.position.x}
          aria-colindex={brick.position.y}
          className="sr-only"
        />
      </div>
    );
  }
  return (
    <button
      disabled={win}
      onClick={() => calculateMove(brick)}
      className={`
        ${rows > 5 ? 'text-lg xs:text-2xl sm:text-4xl md:text-3xl ' : 'text-3xl sm:text-4xl md:text-4xl 2xl:text-5xl '} 
        font-semibold aspect-square bg-blue border border-black text-black rounded-md w-full h-full`}
    >
      <span
        aria-rowindex={brick.position.x}
        aria-colindex={brick.position.y}
        className="sr-only"
      />
      {brick.value}
    </button>
  );
}

export default Brick;
