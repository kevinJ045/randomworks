import time

def getPercent(num):
    percent = num*1/100
    sign = "█"
    st = "█"
    while percent > 0:
        percent = percent - 1
        st = st + sign
    return st

def loop(num):
    print(getPercent(num) + " > " + str(num))
    if num == 1 or num == -5 or num == 0 :
        start()
        return
    time.sleep(0.1)
    if num%2 == 0:
        loop(num/2)
    else:
        loop(3*num+1)

def start():

    num = input("Put a number (type q to exit): ")

    if num == 'q':
         return

    loop(int(num))

def main():
    start()
    
if __name__ == "__main__":
    main()
