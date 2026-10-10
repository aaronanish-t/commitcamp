import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        int n = new Scanner(System.in).nextInt();
        StringBuilder out = new StringBuilder();
        for (int i = 1; i <= n; i++) {
            String word = (i % 3 == 0 ? "Fizz" : "") + (i % 5 == 0 ? "Buzz" : "");
            out.append(word.isEmpty() ? String.valueOf(i) : word).append('\n');
        }
        System.out.print(out);
    }
}
