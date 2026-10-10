#include <iostream>
#include <string>

int main() {
    std::ios::sync_with_stdio(false);
    int n;
    std::cin >> n;
    for (int i = 1; i <= n; i++) {
        std::string word;
        if (i % 3 == 0) word += "Fizz";
        if (i % 5 == 0) word += "Buzz";
        std::cout << (word.empty() ? std::to_string(i) : word) << '\n';
    }
}
