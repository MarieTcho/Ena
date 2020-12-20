class Player(object):
    def __init__(self, id, deck, current_card):
        self.id = id
        self.hand = []
        self.deck=deck

        self.current_card=current_card

    def draw(self) :
        self.hand.append(self.deck.draw())


    def start(self) : 
        for i in range(6):
            self.draw()
    
    def play(self, card_index) : 
        self.current_card[0] = self.hand.pop(card_index)


