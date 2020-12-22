var socket = io();

var current_draged_card ;
var current_container ;
var player_number;
var turn=false;

window.resizeTo(1920, 1080);


socket.on("out_of_room", function(){
  document.getElementById("main").innerHTML = "<h1>YA PLU DE PLACE MDR</h1>";
  socket.disconnect();
  document.getElementById("main").innerHTML = "<h1>YA PLU DE PLACE MDR</h1>";
});


 class Card{
  constructor(color, number){
    this.color = color;
    this.number = number;
    this.position=0;
  }

  draw(){
    document.getElementById("hand").innerHTML += "<div class=\"container\"><div class=\"card card-"+this.color+" pos-" +this.position+  "\" id=\"hand-"+this.color+"-"+this.number+"\" draggable=\"true\" ondragstart=\"drag(event)\"><img class=\"card-img\"  src=\"./static/cards/"+this.number+".png\" draggable=\"false\" /></div>"
  }

  setPosition(position){
    this.position=position;
  }
}


class Hand{
  constructor(){
    this.hand=[];
  }

  updatePosition(){
    for(var i=0; i<this.hand.length; ++i){
      this.hand[i].setPosition(i);
    }
    this.draw();
  }

  add(card){
    this.hand.push(card);
    this.updatePosition();
    sendCardNumber();
  }

  play(index){
    temp = this.hand[index];
    this.hand.splice(index,1);
    return temp;
  }

  getHand(){
    return this.hand;
  }

  draw(){
    document.getElementById("hand").innerHTML = " ";
    for(var card of this.hand){
      card.draw();
    }
  }

  pick(){
    socket.emit("pick_card");
  }
  
  remove(index){
    this.hand.splice(index,1);
    sendCardNumber();
  }

}

function allowDrop(ev) {
  ev.preventDefault();
}



function drag(ev) {
    current_container = ev.target.parentNode;
    current_draged_card = ev.target;
    //ev.dataTransfer.setData("text", ev.target.id);
  
}

function drop_pot(ev) {
  ev.preventDefault();
  document.getElementById("pot").innerHTML=" ";
  //var data = ev.dataTransfer.getData("text");
  //console.log(document.getElementById(data));
  document.getElementById("hand").removeChild(current_container);
  document.getElementById("pot").appendChild(current_draged_card);
  updateDragRights();
  var curr_table = current_draged_card.id.split("-");
  socket.emit("change_pot", curr_table[1]+"-"+curr_table[2]);

  socket.emit("pass_turn", player_number);

  for(var classname of current_draged_card.classList){
    if(classname.split("-")[0]==="pos"){
      
      hand.remove(classname.split("-")[1]);
    }
  }

  hand.updatePosition();
}


function checkAllowed(id){
  for(var child of document.getElementById("pot").childNodes){
    if(child.hasChildNodes()){
      var current_pot_card = child.id;
      var curr_table = current_pot_card.split("-");

      var next_table = id.split("-");

      return (next_table[1]===curr_table[1] || next_table[2]===curr_table[2]);
    }
  }

}

function updateDragRights(){
  var container_list = document.getElementsByClassName("container")
  for(var container of container_list){
    if(checkAllowed(container.childNodes[0].id) && turn){
      container.childNodes[0].draggable = true;
    }
    else{
      container.childNodes[0].draggable = false;      
    }
  }

  for(var child of document.getElementById("pot").childNodes){
    if(child.hasChildNodes()){
      child.draggable = false;
    }
  }
}


// MAIN




var hand = new Hand();

socket.emit('join',"test");


socket.on('join', function(id){
  player_number = id;
  
  for(var i=0; i<6; ++i) {
    hand.pick();
  }
  hand.draw();
});


socket.on("message", function(data){
  console.log(data)
})


socket.on("change_pot", function(data){
  var data_table = data.split("-")
  var pot_color=data_table[0];
  var pot_number=data_table[1];
  document.getElementById("pot").innerHTML="<div class=\"card card-"+pot_color+"\" id=\"hand-"+pot_color+"-"+pot_number+"\" draggable=\"true\" ondragstart=\"drag(event)\"><img class=\"card-img\"  src=\"./static/cards/"+pot_number+".png\" draggable=\"false\" />";
  updateDragRights();
});

socket.on("picked_card", function(data){
  var data_table = data.split("-")
  var card_color=data_table[0];
  var card_number=data_table[1];
  hand.add(new Card(card_color, card_number));
  hand.draw();
  updateDragRights();
});

socket.on("new_turn", function(data){
  if(data==player_number){
    turn=true;
    console.log("IT'S YOUR TURNNNNN !!!!");
    document.getElementById("pass_turn").style.display = "block";
    document.getElementById('hand').style.backgroundColor = "greenyellow" ;
    document.getElementById('hand-adversary').style.backgroundColor = "#f98300" ;
  }
  else{
    turn=false;
    document.getElementById("pass_turn").style.display = "none";
    document.getElementById('hand').style.backgroundColor = "#f98300" ;
    document.getElementById('hand-adversary').style.backgroundColor = "greenyellow" ;
  }
  updateDragRights();
});

document.getElementById("draw_card").addEventListener("click", function(){
  hand.pick();
});

document.getElementById("pass_turn").addEventListener("click", function(){
  socket.emit("pass_turn", player_number);
  
});

function sendCardNumber(){
  socket.emit("card_number", player_number + "-" + hand.getHand().length);
}

socket.on("card_number", function(data){
  var data_table = data.split("-");
  if(data_table[0] != player_number) {
    console.log("Nombre de cartes de l'adversaire: " +  data_table[1]);
    document.getElementById("hand-adversary").innerHTML=" ";
    for(var i=0; i<data_table[1]; ++i){
      document.getElementById("hand-adversary").innerHTML += "<div class=\"container-adversary\"> <div class=\"card-adversary\"  draggable=\"false\" ><img class=\"card-img\"  src=\"./static/cards/MA.png\" draggable=\"false\" /></div></div>";
    }
  }
});