const lines = require("fs").readFileSync(0, "utf8").split(/\r?\n/);
const t = Number(lines[0]);
const pairs = { ")": "(", "]": "[", "}": "{" };

function balanced(s) {
  const stack = [];
  for (const ch of s) {
    if ("([{".includes(ch)) stack.push(ch);
    else if (ch in pairs && stack.pop() !== pairs[ch]) return false;
  }
  return stack.length === 0;
}

const out = [];
for (let i = 1; i <= t; i++) out.push(balanced(lines[i] ?? "") ? "YES" : "NO");
console.log(out.join("\n"));
