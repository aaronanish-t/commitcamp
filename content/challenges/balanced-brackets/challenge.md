---
title: Balanced Brackets
summary: Decide whether every (, [ and { in a string is closed in the right order.
difficulty: easy
tags: [stacks, strings]
author: aaronanish-t
---

A string is **balanced** if every opening bracket — `(`, `[` or `{` — is closed by the matching bracket, and pairs close in the reverse order they opened. `([]{})` is balanced; `([)]` is not, and neither is `((`.

Characters other than brackets don't matter and can be ignored.

## Input

The first line holds `t`, the number of strings. Each of the next `t` lines holds one string (possibly empty, at most 10⁴ characters).

## Output

For each string, print `YES` if it is balanced and `NO` otherwise.

## Example

```
3
([]{})
([)]
f(x[0]) + {y}
```

prints

```
YES
NO
YES
```
