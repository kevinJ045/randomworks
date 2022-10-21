def percentager():
    num = input('Put number (q to quit): ')
    if num == 'q':
        return
    num = float(num)
    if num < 100:
        num = num * 100
    if num > 100:
        num = num / 10
    if num == 100:
        num = 1000
    pers = num/10
    while pers > 100:
        pers = pers/10
    print(pers)
    percentager()

percentager()
