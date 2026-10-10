---
title: Word Frequency
summary: Find the k most common words in a block of text, breaking ties alphabetically.
difficulty: medium
tags: [hashing, sorting, strings]
author: aaronanish-t
---

Given some text, report the `k` words that appear most often.

A **word** is a maximal run of the letters `a`–`z`, compared case-insensitively — so `Don't` contains the words `don` and `t`, and `The` and `the` are the same word.

Order the result by count, highest first. When two words have the same count, the one that comes first alphabetically wins. If the text has fewer than `k` distinct words, print all of them.

## Input

The first line holds `k` (1 ≤ k ≤ 100). Everything after it is the text, which may span many lines.

## Output

Up to `k` lines, each a word and its count separated by a single space.

## Example

```
2
The cat and the hat.
THE END
```

prints

```
the 3
and 1
```

`and`, `cat`, `end` and `hat` all appear once; `and` is first alphabetically.
