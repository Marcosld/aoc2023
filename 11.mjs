const input = `...............#.......................................................#................#...................................................
........#.............................................#...........................#.........................................................
.....................................#......#................................................#......#......................................#
...............................#...............................#.........................................#............................#.....
.........................#.......................................................................................................#..........
.............#.....................................#.......#.......#........................................................................
.......................................................................................#...................................#................
........................................................................#......#...................#........................................
..........................................#.....................#..............................................#.......................#....
....#...............#...................................#..............................................................#....................
..............................#..........................................................#.................................................#
................................................#...........................................................................................
...........#........................#..................................................................#....................................
...............................................................................#...............#...................#.......#................
.....#.............#............#...........#..........................................................................................#....
...........................#...........................................................................................#....................
...........................................................................#................................................................
.......................................................#......#.....................#.......................................................
...#...........................................#.................................................................#..............#...........
...............#...................#............................................................#..........................................#
.......#................................................................#..................................#..............#..........#......
.......................................#....................................................................................................
......................#.....................#......................#........................................................................
..............................................................................#........................#....................................
.....#........................#.........................................................................................#.......#...........
...................#........................................#...............................................................................
.........#................#.........................#............#........................#....................#.....................#......
.#..................................................................................#.......................................................
.....................................................................#......#......................#........................#...............
................#......................................#............................................................#.............#.........
.....#................#......................#................#.............................................................................
...............................#............................................................................................................
.....................................#.........................................#........#.................#................................#
.................................................................................................#..........................................
...#........#...........................................#.........#................#.................................#......................
...................................................................................................................................#........
...................................................#...........................................................#...........#................
.........................#..................#...............................#..........................#....................................
...................#..........................................#.............................#............................................#..
.......#..........................................................................................................#.........................
..............................#......#..............................#............................#...................................#......
..................................................................................#...........................#.........#...................
.........................................................#..................................................................................
............#....................#........#...............................#..............................#..................................
...............................................#...................................................#..........................#.............
............................................................#...............................................................................
........................#.............................#...................................#.........................................#.......
............................................................................................................................................
........................................................................................................................#...................
..................................................................#.........................................................................
..............................................................................#...............................#.............................
.............................#........#.....#...........#............................#...............#......................#...............
.#............................................................#............................#..........................................#.....
......................#.............................................#.......................................................................
..............#.....................................#.......................................................................................
.........................................#.....................................#.......................#....................................
...............................#...............................................................................#.......#..................#.
..#.......#.................................................................................................................................
...................................#......................................................#...............#.................................
...............................................#....................#...............................#.............................#.........
.......................................................#....................#.....#............#............................................
.............#........#.......................................#.............................................................................
.......................................................................................................................#..............#.....
............................................................................................................................................
....#.....................#.........#.....................#..............#........................#.........................................
..................#......................#......#...................#...................#.................#..............................#..
..............................#...............................................................#.............................................
.............................................................#......................................................#.......................
.......................#.........................................................#........................................#.....#...........
..........#.................................................................#...............................................................
................#......................................................................#..........#.............#...........................
.....#............................#...........#....................#..................................................................#.....
......................................................#.....................................#...............#...............................
..............................................................#.....................#....................................#.....#............
........................................................................#..................................................................#
..#........................#..............................#....................#............................................................
............................................................................................................................................
.........#........#.....................#.........................................................................#.........................
.....................................................................................#....................................#.................
............................................#..........#.....................#................#...........#.................................
...................................................................#.................................................................#......
.#................................................#.....................#...................................................................
...............#......#.....#.............................#.........................................#.......................................
............................................................................................................................................
......#...........................#............................................................................................#............
.......................................#....................................................#...........................#.................#.
..................#.................................#...........#.........#........................................#........................
.....................................................................#.........#............................................................
...#..................#.......................#........................................................................................#....
........................................................#.............................#.....................#...............................
....................................#.............................................................#...............................#.........
.........#.....#.............#............................................................................................#.................
...........................................................................#...........................#.........#..........................
....#....................#...................#..........................................#.............................................#.....
...............................................................#...................#..........#.............................................
...............................................................................................................................#............
.................#......................................#...................................................................................
...........................................#............................#.........................................#.........................
.....................#...........................................................................#..........................#...............
..............#.................#....................................................#.................................#....................
.........#............................#...................................................#...........#...............................#.....
...............................................................................................................#............................
..................#...........................................#..................................................................#..........
.......................................................................#...........#.....................#..................................
............................................................................................................................................
........................#.....................................................#............................................#................
.................................#..........#.....#..........................................#..........................................#...
...#...............................................................#.........................................#..............................
..............#..........................................#...........................#..................................#.....#.............
.......#..................................................................................#........................#........................
...................................#........................................#...............................................................
........................#...........................................................................#..........#............................
...................................................#............................#.................................................#.........
.........#..............................#...............#................#.............................................#..................#.
#..............#.............#..........................................................#...................................................
.............................................................#..............................................................................
.........................#...........................#...........................................#...........#.....#........................
............#..................................#............................................................................................
.....................#..................................................................................................#...................
............................#.................................................#..........................#..................................
.......................................................#.........#..................#.........................................#.............
....................................#.............#........................................#......................#.........................
......................................................................................................#.....................................
.............................................#..........................#...................................................................
.........#.........................................................................................................................#.......#
............................................................................................................................................
.#............#..................#.............................................#..........#......#..........................................
.......................#..........................#...................#...........................................#.........................
.....#...............................................................................................#.......#...........#..................
.......................................................#......#................................................................#........#...
..........................#.................................................................................................................
............................................................................................#...............................................
.#.....#.........................#................................................................#.................#................#......
....................................................#...................#.....#...........................................................#.
......................#...............#..................#..........................#...........................#................#..........
.................#............................................#.............................................................................
..........................................#........................#...........................#.......#...................#................
.....#...................#.......................................................#..........................................................
...................................................#.................................................................#.................#....
...........#......................#.........................#...............................#.....................................#.........`;

const getExpanded = (grid) => {
  const expandedI = [];
  const expandedJ = [];
  for (let i = grid.length - 1; i >= 0; i--) {
    if (grid[i].every((c) => c === ".")) {
      expandedI.push(i);
    }
  }

  for (let j = grid[0].length - 1; j >= 0; j--) {
    let allDots = true;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][j] !== ".") {
        allDots = false;
        break;
      }
    }
    if (allDots) {
      expandedJ.push(j);
    }
  }
  return [expandedI, expandedJ];
};

const findGalaxies = (grid) => {
  const galaxies = [];
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] === "#") {
        galaxies.push([i, j]);
      }
    }
  }
  return galaxies;
};

const mDisWithExpansions = (
  [i, j],
  [ii, jj],
  expandedIs,
  expandedJs,
  expansionFactor,
) => {
  const OFFSET = expansionFactor - 1;
  let iExpand = 0,
    jExpand = 0;

  const fromI = Math.min(i, ii);
  const toI = Math.max(i, ii);
  const fromJ = Math.min(j, jj);
  const toJ = Math.max(j, jj);

  for (const ei of expandedIs) {
    if (fromI < ei && ei < toI) {
      iExpand += OFFSET;
    }
  }

  for (const ej of expandedJs) {
    if (fromJ < ej && ej < toJ) {
      jExpand += OFFSET;
    }
  }

  return toI + toJ + iExpand + jExpand - fromI - fromJ;
};

const solve = (input, expansionFactor) => {
  const grid = input.split("\n").map((line) => line.split(""));

  const [expandedIs, expandedJs] = getExpanded(grid);

  const galaxies = findGalaxies(grid);

  let result = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i; j < galaxies.length; j++) {
      result += mDisWithExpansions(
        galaxies[i],
        galaxies[j],
        expandedIs,
        expandedJs,
        expansionFactor,
      );
    }
  }

  return result;
};

const solve1 = (input) => solve(input, 2);

const solve2 = (input) => solve(input, 1000000);

console.log(solve1(input));
console.log(solve2(input));
