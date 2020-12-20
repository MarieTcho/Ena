import flask #Serveur flask
import requests #Library de requêtes HTTP, pour obtenir nos pages HTML
from flask_socketio import SocketIO, send, emit, join_room #Toutes nos fonctions de sockets
import json #Pour le formattage des données
import sys

sys.path.append(".")

from cards import Card
from deck import Deck
from player import Player

d=Deck()


current_card = d.draw()

new_player_id = 0
player_list=[]

APP = flask.Flask(__name__)
socketio = SocketIO(APP)


def increment(val):
    val+=1

@socketio.on('join')
def handle_join(data):
    emit("join",new_player_id)
    player_list.append(Player(new_player_id,d,current_card))
    increment(new_player_id)
    
@socketio.on('get_card')
def handle_get_card(data):
    temp = current_card.toString()
    emit("send_card", temp)


@APP.route('/')
def index():
    return flask.render_template('index.html')

if __name__ == '__main__':
    APP.debug = True
    socketio.run(APP)

