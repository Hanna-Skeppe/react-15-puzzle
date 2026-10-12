import { describe, expect, it } from 'vitest';
import { IBrick } from './types/types';
import {
  checkWin,
  createShuffledArray,
  isMoveable,
  isSolvable,
  updateBrickPosition,
} from './utils';
import { BOARD_SIZES } from './constants';

// Builds a board from values in reading order, e.g. [1, 2, 3, 0] on 2×2:
const board = (values: number[], columns: number): IBrick[] =>
  values.map((value, index) => ({
    value,
    position: { x: Math.floor(index / columns), y: index % columns },
  }));

describe('checkWin', () => {
  it('accepts bricks in order with the space last', () => {
    expect(checkWin(board([1, 2, 3, 4, 5, 6, 7, 8, 0], 3))).toBe(true);
  });

  it('rejects the space first', () => {
    expect(checkWin(board([0, 1, 2, 3, 4, 5, 6, 7, 8], 3))).toBe(false);
  });

  it('rejects two bricks in the wrong order', () => {
    expect(checkWin(board([1, 2, 3, 4, 5, 6, 8, 7, 0], 3))).toBe(false);
  });
});

describe('isSolvable', () => {
  it('accepts a solved 3×3 board', () => {
    expect(isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0], 3, 3)).toBe(true);
  });

  it('rejects a 3×3 board with two bricks swapped', () => {
    expect(isSolvable([1, 2, 3, 4, 5, 6, 8, 7, 0], 3, 3)).toBe(false);
  });

  it('accepts a solved 4×4 board', () => {
    expect(
      isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0], 4, 4)
    ).toBe(true);
  });

  it("rejects Sam Loyd's 14–15 puzzle", () => {
    expect(
      isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0], 4, 4)
    ).toBe(false);
  });

  it('accepts a 4×4 board one move from solved (space moved up)', () => {
    expect(
      isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12], 4, 4)
    ).toBe(true);
  });
});

describe('createShuffledArray', () => {
  it.each(BOARD_SIZES)(
    'always creates a solvable $rows×$columns board',
    ({ rows, columns }) => {
      for (let i = 0; i < 1000; i++) {
        const values = createShuffledArray(rows, columns).map((b) => b.value);
        expect(isSolvable(values, rows, columns)).toBe(true);
      }
    }
  );

  it('contains every value exactly once', () => {
    const values = createShuffledArray(4, 4).map((b) => b.value);
    expect([...values].sort((a, b) => a - b)).toEqual([...Array(16).keys()]);
  });
});

describe('updateBrickPosition', () => {
  // 1 2 3
  // 4 5 6
  // 7 8 _
  const solved = board([1, 2, 3, 4, 5, 6, 7, 8, 0], 3);
  const space = solved[8];
  const values = (bricks: IBrick[]) => bricks.map((b) => b.value);

  it('moves one brick sideways into the space', () => {
    const result = updateBrickPosition(solved[7], space, 'y', solved);
    expect(values(result)).toEqual([1, 2, 3, 4, 5, 6, 7, 0, 8]);
  });

  it('moves one brick down into the space', () => {
    const result = updateBrickPosition(solved[5], space, 'x', solved);
    expect(values(result)).toEqual([1, 2, 3, 4, 5, 0, 7, 8, 6]);
  });

  it('moves several bricks in a row at once', () => {
    const result = updateBrickPosition(solved[6], space, 'y', solved);
    expect(values(result)).toEqual([1, 2, 3, 4, 5, 6, 0, 7, 8]);
  });

  it('moves several bricks in a column at once', () => {
    const result = updateBrickPosition(solved[2], space, 'x', solved);
    expect(values(result)).toEqual([1, 2, 0, 4, 5, 3, 7, 8, 6]);
  });
});

describe('isMoveable', () => {
  const solved = board([1, 2, 3, 4, 5, 6, 7, 8, 0], 3);
  const space = solved[8];

  it('accepts a brick in the same row as the space', () => {
    expect(isMoveable(solved[6], space)).toBe(true);
  });

  it('accepts a brick in the same column as the space', () => {
    expect(isMoveable(solved[2], space)).toBe(true);
  });

  it('rejects a brick in another row and column', () => {
    expect(isMoveable(solved[0], space)).toBe(false);
  });

  it('rejects the space itself', () => {
    expect(isMoveable(space, space)).toBe(false);
  });
});
