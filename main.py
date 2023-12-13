import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import datetime

def main():
    # make up some data
    x = [mdates.datetime.datetime(2023, 9, 3, 0, 0),
         mdates.datetime.datetime(2023, 9, 4, 0, 0),
         mdates.datetime.datetime(2023, 9, 5, 0, 0),
         mdates.datetime.datetime(2023, 9, 6, 0, 0),
         mdates.datetime.datetime(2023, 9, 7, 0, 0),
         mdates.datetime.datetime(2023, 9, 8, 0, 0),
         mdates.datetime.datetime(2023, 9, 9, 0, 0),
         mdates.datetime.datetime(2023, 9, 10, 0, 0),
         ]
    y = [-4.4, -3.9, -3.7, -117.0, -124.9, -153.1, -179.9, -155.7]

    # title
    plt.title('The amount of braincells in Vendetta')
    
    colors = ['red' if date >= datetime.datetime(2023, 9, 6, 0, 0) else 'blue' for date in x]

    # bar plot
    plt.bar(x, y, color=colors)

    # beautify the x-labels
    plt.gcf().autofmt_xdate()

    plt.show()

if __name__ == '__main__':
    main()