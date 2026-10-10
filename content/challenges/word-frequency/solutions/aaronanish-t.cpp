#include <algorithm>
#include <cctype>
#include <iostream>
#include <iterator>
#include <map>
#include <string>
#include <vector>

int main() {
    int k;
    std::cin >> k;
    std::string text((std::istreambuf_iterator<char>(std::cin)), std::istreambuf_iterator<char>());

    // std::map keeps words in alphabetical order, so a stable sort by count
    // leaves ties alphabetical without a second comparison.
    std::map<std::string, int> counts;
    std::string word;
    for (char c : text + ' ') {
        char lower = static_cast<char>(std::tolower(static_cast<unsigned char>(c)));
        if (lower >= 'a' && lower <= 'z') {
            word += lower;
        } else if (!word.empty()) {
            counts[word]++;
            word.clear();
        }
    }

    std::vector<std::pair<std::string, int>> ranked(counts.begin(), counts.end());
    std::stable_sort(ranked.begin(), ranked.end(),
                     [](const auto& a, const auto& b) { return a.second > b.second; });
    for (int i = 0; i < k && i < static_cast<int>(ranked.size()); i++) {
        std::cout << ranked[i].first << ' ' << ranked[i].second << '\n';
    }
}
