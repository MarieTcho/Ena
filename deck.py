from cards import Card
import random

class Deck(object):
    def __init__(self):
        self.deck=[]
        self.start()
        self.shuffle()
        #self.toString()


    def start(self):
        for color in range(4):
            for number in range(12):    
                self.deck.append(Card(color,number))
        for color in range(4):
            for number in range(12):    
                self.deck.append(Card(color,number))
        
        self.deck.append(Card(5,12))
        self.deck.append(Card(5,12))
        self.deck.append(Card(5,12))
        self.deck.append(Card(5,12))
            
    def toString(self):
        for card in self.deck : 
            card.toString()

    def draw(self) :
        return self.deck.pop()
    
    def shuffle(self) :
        random.shuffle(self.deck)
