const n = Number(require("fs").readFileSync(0, "utf8").trim());
const lines = [];
for (let i = 1; i <= n; i++) {
  const word = (i % 3 === 0 ? "Fizz" : "") + (i % 5 === 0 ? "Buzz" : "");
  lines.push(word || String(i));
}
console.log(lines.join("\n"));
