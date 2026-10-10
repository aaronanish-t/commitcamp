import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.StringTokenizer;

public class Main {
    public static void main(String[] args) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
        StringTokenizer st = new StringTokenizer(in.readLine());
        int r = Integer.parseInt(st.nextToken());
        int c = Integer.parseInt(st.nextToken());

        char[][] grid = new char[r][];
        int start = -1;
        for (int i = 0; i < r; i++) {
            grid[i] = in.readLine().trim().toCharArray();
            for (int j = 0; j < c; j++) if (grid[i][j] == 'S') start = i * c + j;
        }

        int[] dist = new int[r * c];
        Arrays.fill(dist, -1);
        dist[start] = 0;
        ArrayDeque<Integer> queue = new ArrayDeque<>();
        queue.add(start);
        int[][] moves = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};

        while (!queue.isEmpty()) {
            int cell = queue.poll();
            int i = cell / c, j = cell % c;
            if (grid[i][j] == 'E') {
                System.out.println(dist[cell]);
                return;
            }
            for (int[] m : moves) {
                int ni = i + m[0], nj = j + m[1];
                if (ni < 0 || nj < 0 || ni >= r || nj >= c || grid[ni][nj] == '#') continue;
                int next = ni * c + nj;
                if (dist[next] != -1) continue;
                dist[next] = dist[cell] + 1;
                queue.add(next);
            }
        }
        System.out.println(-1);
    }
}
