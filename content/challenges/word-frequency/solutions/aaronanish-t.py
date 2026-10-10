import re
import sys
from collections import Counter

k_line, _, text = sys.stdin.read().partition("\n")
k = int(k_line)
counts = Counter(re.findall(r"[a-z]+", text.lower()))
for word, n in sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))[:k]:
    print(word, n)
