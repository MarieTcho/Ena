var socket = io();
var connected = false;
socket.emit('join',"color_popup");

socket.on("join", function(){
    connected=true;
    console.log("balajfdo");
})

function choose_color(ev){
    var id_table = ev.target.id.split("-");
    // socket.emit("chosen_color", color);
    while(!connected){
        //console.log(id_table[1]);
        socket.emit("chosen_color", id_table[1]);
    }

    
    console.log(id_table[1]);
    socket.emit("chosen_color", id_table[1]);
    setTimeout(function(){ window.close();}, 500);
}

document.getElementById("btn-0").addEventListener("click", choose_color);
document.getElementById("btn-1").addEventListener("click", choose_color);
document.getElementById("btn-2").addEventListener("click", choose_color);
document.getElementById("btn-3").addEventListener("click", choose_color);