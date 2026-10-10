import sys

PAIRS = {")": "(", "]": "[", "}": "{"}


def balanced(s):
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in PAIRS:
            if not stack or stack.pop() != PAIRS[ch]:
                return False
    return not stack


lines = sys.stdin.read().split("\n")
t = int(lines[0])
for i in range(1, t + 1):
    line = lines[i] if i < len(lines) else ""
    print("YES" if balanced(line) else "NO")
