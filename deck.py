from cards import Card

class Deck(object):
    def __init__(self):
        self.deck=[]
        self.start()
        #self.toString()

    def start(self):
        for color in range(4):
            for number in range(10):    
                self.deck.append(Card(color,number))
            
    def toString(self):
        for card in self.deck : 
            card.toString()
