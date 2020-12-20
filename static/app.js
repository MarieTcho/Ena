var socket = io();
socket.emit('join',"test");

socket.emit('get_card',"test");

socket.on("send_card", function(data){
  console.log(data);
  
});

socket.on('join', function(id){
    console.log(id);
    
  });


socket.on("message", function(data){
  console.log(data)
})


class Card{
  constructor(color, number){
    this.color = color;
    this.number = number;
  }
}


class Hand{
  constructor(){
    this.hand=[];
  }

  add(card){
    this.hand.push(card);
  }

  play(index){
    temp = this.hand[index];
    this.hand.splice(index,1);
    return temp;
  }

  getHand(){
    return this.hand;
  }
}

