export const createShuffledArray = (
  rows: number,
  columns: number
): IBrick[] => {
  const numSquares = rows * columns;
  const arr = Array.from({ length: numSquares }, (_, index) => index);

  //Randomly shuffle array elements:
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // Assign value and positions to elements:
  return arr.map((value, index) => ({
    value,
    position: {
      x: Math.floor(index / columns),
      y: index % columns,
    },
  }));
};

export const getInBetweenBricks = (
  brick: IBrick,
  space: IBrick,
  axisToMove: 'x' | 'y',
  bricks: IBrick[]
) => {
  const [start, end] = [
    brick.position[axisToMove],
    space.position[axisToMove],
  ].sort((a, b) => a - b);

  // Get axis to compare:
  const sameAxis = axisToMove === 'x' ? 'y' : 'x';

  // Filter bricks between start and end on correct axis:
  const inBetweens = bricks.filter(
    (b) =>
      b.position[axisToMove] > start &&
      b.position[axisToMove] < end &&
      b.position[sameAxis] === brick.position[sameAxis]
  );
  return inBetweens;
};

export const updateBrickPosition = (
  brick: IBrick,
  space: IBrick,
  axisToMove: 'x' | 'y',
  bricks: IBrick[]
) => {
  // Get bricks in between brick and space:
  const inBetweens = getInBetweenBricks(brick, space, axisToMove, bricks);

  // Decide on increase or decrease positions:
  const decrease = space.position[axisToMove] < brick.position[axisToMove];

  let updatedBricks: IBrick[] = [];

  bricks.forEach((b) => {
    // Space will always take the position of brick:
    if (b.value === space.value) {
      updatedBricks.push({
        value: b.value,
        position: { x: brick.position.x, y: brick.position.y },
      });
    }
    // The other bricks to move (using decrease or increase):
    if (
      b.value === brick.value ||
      inBetweens.some((i) => i.value === b.value)
    ) {
      updatedBricks.push({
        value: b.value,
        position: {
          ...b.position,
          [axisToMove]: decrease
            ? b.position[axisToMove] - 1
            : b.position[axisToMove] + 1,
        },
      });
    } else if (b.value !== 0) {
      // Keep positions for all other bricks except space:
      updatedBricks.push(b);
    }
    // Sort all bricks in order based on positions:
    updatedBricks = updatedBricks.sort(
      (a, b) => a.position.x - b.position.x || a.position.y - b.position.y
    );
  });

  return updatedBricks;
};

export const checkWin = (bricks: IBrick[]) => {
  let isInOrder = true;
  let spaceAtStartOrEnd = false;

  for (let i = 0; i < bricks.length; i++) {
    const value = bricks[i].value;

    //Check if all bricks are in order
    if (i < bricks.length - 1 && value !== i + 1) {
      isInOrder = false;
      break;
    }
    // Check if space (0) is first or last
    if (value === 0) {
      if (i === 0 || i === bricks.length - 1) {
        spaceAtStartOrEnd = true;
      } else {
        isInOrder = false;
        spaceAtStartOrEnd = false;
      }
    }
  }
  return isInOrder && spaceAtStartOrEnd;
};
