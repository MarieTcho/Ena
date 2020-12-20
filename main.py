import flask #Serveur flask
import requests #Library de requêtes HTTP, pour obtenir nos pages HTML
from flask_socketio import SocketIO, send, emit, join_room #Toutes nos fonctions de sockets
import json #Pour le formattage des données
import sys

sys.path.append(".")

from cards import Card
from deck import Deck

d=Deck()



APP = flask.Flask(__name__)
socketio = SocketIO(APP)


@socketio.on('join')
def handle_join(data):
    print(data)


    

@APP.route('/')
def index():
    return flask.render_template('index.html')

if __name__ == '__main__':
    APP.debug= True
    socketio.run(APP)

