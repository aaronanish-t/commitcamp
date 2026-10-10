---
title: Grid Shortest Path
summary: Find the fewest steps from S to E through a maze of walls.
difficulty: medium
tags: [graphs, bfs]
author: aaronanish-t
---

You're given a grid of open cells (`.`), walls (`#`), one start (`S`) and one exit (`E`). Each step moves one cell up, down, left or right, never through a wall or off the grid.

Print the fewest steps it takes to get from `S` to `E`, or `-1` if `E` can't be reached.

## Input

The first line holds `r` and `c` (1 ≤ r, c ≤ 1000). The next `r` lines each hold `c` characters.

## Output

A single integer.

## Example

```
3 4
S..#
.#..
...E
```

prints

```
5
```

Breadth-first search finds this in O(r·c). Depth-first search finds *a* path, which isn't the same thing.
