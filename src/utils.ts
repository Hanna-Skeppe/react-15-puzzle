import { IBrick } from './types/types';

// Checks if the order (0 = space) can be solved to 1, 2, ..., 0:
export const isSolvable = (
  arr: number[],
  rows: number,
  columns: number
): boolean => {
  const bricks = arr.filter((value) => value !== 0);

  // Count pairs of bricks in the wrong order (inversions):
  let inversions = 0;
  for (let i = 0; i < bricks.length; i++) {
    for (let j = i + 1; j < bricks.length; j++) {
      if (bricks[i] > bricks[j]) inversions++;
    }
  }

  // Odd width: moves never change the parity of inversions.
  if (columns % 2 === 1) return inversions % 2 === 0;

  // Even width: a vertical move flips the parity of inversions, so the
  // row of the space (counted from the bottom) must be included:
  const spaceRowFromBottom = rows - 1 - Math.floor(arr.indexOf(0) / columns);
  return (inversions + spaceRowFromBottom) % 2 === 0;
};

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

  // Half of all shuffles are unsolvable. Swapping two bricks (not the space)
  // flips the parity and makes the puzzle solvable:
  if (!isSolvable(arr, rows, columns)) {
    const [a, b] = arr
      .map((value, index) => (value !== 0 ? index : -1))
      .filter((index) => index !== -1);
    [arr[a], arr[b]] = [arr[b], arr[a]];
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
  const lastIndex = bricks.length - 1;

  // Check if all bricks are in order
  for (let i = 0; i < lastIndex; i++) {
    if (bricks[i].value !== i + 1) return false;
  }

  // Check if space (0) is last:
  return bricks[lastIndex].value === 0;
};

export const isMoveable = (brick: IBrick, space: IBrick) => {
  return (
    brick.value !== 0 &&
    (brick.position.x === space.position.x ||
      brick.position.y === space.position.y)
  );
};
