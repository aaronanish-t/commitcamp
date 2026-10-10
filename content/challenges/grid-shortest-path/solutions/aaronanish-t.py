import sys
from collections import deque

tokens = sys.stdin.read().split()
r, c = int(tokens[0]), int(tokens[1])
grid = tokens[2 : 2 + r]

start = next((i, j) for i in range(r) for j in range(c) if grid[i][j] == "S")
dist = [[-1] * c for _ in range(r)]
dist[start[0]][start[1]] = 0
queue = deque([start])

while queue:
    i, j = queue.popleft()
    if grid[i][j] == "E":
        print(dist[i][j])
        break
    for ni, nj in ((i + 1, j), (i - 1, j), (i, j + 1), (i, j - 1)):
        if 0 <= ni < r and 0 <= nj < c and grid[ni][nj] != "#" and dist[ni][nj] == -1:
            dist[ni][nj] = dist[i][j] + 1
            queue.append((ni, nj))
else:
    print(-1)
