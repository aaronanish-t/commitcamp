n = int(input())
for i in range(1, n + 1):
    word = ("Fizz" if i % 3 == 0 else "") + ("Buzz" if i % 5 == 0 else "")
    print(word or i)
