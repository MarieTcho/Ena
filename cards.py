

class Card(object):
    
    def __init__(self, color, number) :
        self.color=color
        self.number=number

    def toString(self):
        print(str(self.color) + " " + str(self.number))    
