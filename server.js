const http = require('http');
const express = require('express');
const io = require('socket.io');

/******************** Express ********************/

const app = express();

app.use(express.static('public'));

app.get('/', (request, response) => {
      return response.sendFile('index.html' , { root : __dirname});
});

const httpServer = app.listen(3000, () => {
    console.log('Server started on 3000')
});

/******************** socket.io ********************/

//HTTP req upgrade + establish WS cnx
const Server = io.Server;
const ioServer = new Server(httpServer);

const allBats = {}
var game = false;

ioServer.on('connection', (socket) => {

/******** Bat ******/
    socket.on('newBat',() => {

        const myBat = {
            batId: socket.id,
            batHeight: 15,
            batWidth: 50,
            batY: 0,
            //batX: (canvas.width-batWidth) / 2
            // batX: (480-myBat.batWidth) / 2
            batX: (480-50) / 2
        };
    
        console.log('Player:', myBat.batId);
        
        allBats[myBat.batId] = myBat;

        console.log('index:', Object.keys(allBats).length);

        if(2 === Object.keys(allBats).length){
            myBat.batY = 320-15;
            game = true;

            // //Create all bats of all players
            // for(batId in allBats) {
            //     const bat = allBats[batId];
            //     // sends bats through all sockets to all clients
            //     //setInterval(()=>{ioServer.emit('sendBall', bat)}, 16);
            //     setInterval(()=>{ioServer.emit('frame', bat)}, 1000 / 60);
            //     //ioServer.emit('sendBall', bats);
            // }
        };

        if(2 < Object.keys(allBats).length){
            socket.disconnect();
            delete allBats[myBat.batId]
        }
    });

    socket.on('mousemove', (position) => {
        var bat = allBats[socket.id] || {};

        // var relativeX = e.clientX - canvas.offsetLeft;
        var relativeX = position.x - position.cOffsetLeft;
        //if(relativeX > 0 && relativeX < canvas.width) {
        if(relativeX > 0 && relativeX < position.cWidth) {
            bat.batX = relativeX - bat.batWidth/2;
        }
        //ioServer.emit('frame', myBat);
        //setInterval(()=>{ioServer.emit('sendBall', myBat)}, 100);
    });

}); //io.on('connection'

setInterval(()=>{
    if(game){
        ioServer.emit('frame', allBats) 
    } 
}, 1000 / 60);


    // setInterval(()=>{ioServer.emit('frame', allBats)}, 1000 / 60);


/******** tests ******/

// //Create all bats of all players
    // for(batId in allBats) {
    //     const bat = allBats[batId];
    //     // sends bats through all sockets to all clients
    //     setInterval(()=>{ioServer.emit('sendBall', bat)}, 10);
    //     //ioServer.emit('sendBall', bats);
    // };

    //interval = setInterval(()=>{ioServer.emit('sendBall', myBat)}, 10);
   
    //     //let interval = setInterval(()=>{requestAnimationFrame(ioServer.emit('sendBall'))}, 10);
        
    //     //interval = setInterval(()=>{ioServer.emit('sendBall')}, 10);
    //     interval = setInterval(()=>{ioServer.emit('sendBall')}, 10);
    //     // if(allSockets.length>4 ) {
    //     //     clearInterval(interval);
    //     // }
   
    // } else {
    //     clearInterval(interval);


/******** notes ******/
    // Create my Bat
    // sends myBat through all sockets to all clients
     //ioServer.emit('sendBat', myBat);

    //allBats[myBat.id] = myBat;

    // Create all bats of all clients
    // for(batId in allBats) {
    //     const bats = allBats[batId];
    //     // sends bats through all sockets to all clients
    //     ioServer.emit('sendBat', bats);
    // }


/******************** DOC ********************/
//Server instance:

//the Server instance emits one single event fired upon a new connection (first argument is a Socket instance)
// io.on('connection, (socket) => {
//   // ...
// });

//emit to all connected clients
//io.emit(/* ... */);

//herits EventEmitter NodeJS:
//emitter.on(eventName, listener)
//emitter.emit(eventName[, ...args])
// Synchronously calls each of the listeners registered for the event named eventName, in the order they were registered, passing the supplied arguments to each
