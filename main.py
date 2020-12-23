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

current_player=[0]

current_card = [d.draw()]

new_player_id = [0]
player_list=[]

APP = flask.Flask(__name__)
socketio = SocketIO(APP)


def increment(val):
    val+=1

def change_val(var, val):
    var = val

@socketio.on('join')
def handle_join(data):
    if new_player_id[0]<=1:
        emit("join",new_player_id[0])
        emit("change_pot", str(current_card[0].color)+"-"+str(current_card[0].number))
        player_list.append(Player(new_player_id[0]))
        new_player_id[0] = new_player_id[0]+1
        print(new_player_id[0])
        emit("new_turn", str(current_player[0]), broadcast=True)
    else:
        emit("out_of_room")
    
@socketio.on('change_pot')
def handle_change_pot(data):
    data_table = data.split('-')
    current_card[0]=Card(data_table[0], data_table[1])
    emit("change_pot", str(current_card[0].color)+"-"+str(current_card[0].number), broadcast=True)


@socketio.on('pick_card')
def handle_pick_card() :
    picked_card = d.draw()
    emit("picked_card", str(picked_card.color)+"-"+str(picked_card.number))

@socketio.on('pass_turn')
def handle_pass_turn(data) :
    player_list[int(data)].turn = False
    current_player[0] =  (int(data) + 1)% new_player_id[0]
    print( "MODULO" + str(current_player[0]))
    player_list[current_player[0]].turn = True
    emit("new_turn", str(current_player[0]), broadcast=True)

@socketio.on("card_number")
def handle_card_number(data):
    emit("card_number", data, broadcast=True)

@APP.route('/')
def index():
    return flask.render_template('index.html')

if __name__ == '__main__':
    APP.debug = True
    socketio.run(APP,host='0.0.0.0')


