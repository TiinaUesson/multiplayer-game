//window.document.addEventListener('DOMContentLoaded', () => {

/******** create socket instance ******/ 
    const socket = io('http://localhost:3000');

/******** Canvas ******/ 
    let canvas = document.getElementById("myCanvas");
    canvas.width = 480;
    canvas.height = 320;
    let ctx = canvas.getContext("2d");

/******** Ball ******/
    var ballRadius = 10;
  
    //coordinates
    var x = canvas.width/2;
    var y = canvas.height-30;

    //move value
    var dx = 2;
    var dy = -2;

/******** draw Ball ******/
    const drawBall = () => {

        ctx.beginPath();
        ctx.arc(x, y, ballRadius, 0, Math.PI*2);
        // ctx.arc(myBall.x, myBall.y, myBall.ballRadius, 0, Math.PI*2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
        ctx.closePath();

    };

/******** draw Bat ******/ 
    const drawBat = (allBats) => {

        for(batId in allBats) {
            const bat = allBats[batId];
            ctx.beginPath();
            ctx.rect(bat.batX, bat.batY, bat.batWidth, bat.batHeight);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        }
    };

/******** clear + draw ******/
    const draw = (allBats) => {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawBall();
        drawBat(allBats);
       
        //change ball coordinates  
        x += dx;
        y += dy;

        //chq collision ball + horizontal walls
        if(ballRadius > x + dx || canvas.width-ballRadius < x + dx){
            dx = -dx;
            //ballColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6); 
        }
        //chq collision ball + vertical walls
        if(ballRadius > y + dy || canvas.height-ballRadius < y + dy){
            dy = -dy
            //ballColor = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
        }
    };

    //declare socketlistener function on event draw(objectToDraw)

// /******** socketEventHandler Bat ******/   
//     socket.on('sendBat', (myBat) => {
//         console.log('sendBat')

//         const batElement = drawBat(myBat);
        
//     })

/******** socketEventHandler Frame ******/  
    socket.on('frame', (allBats) => {
        console.log('frame')
        //ctx.clearRect(0, 0, canvas.width, canvas.height);
        //setInterval(drawBall(), 100);
        draw(allBats);
        //drawBall();
        
    });

    //ioServer.emit('sendBall', myBall);
    

/******** eventListener on mousemove ******/ 

    const position = {
        x: '',
        cOffsetLeft:canvas.offsetLeft,
        cWidth:canvas.width,
        // y: e.clientY
    }

    window.addEventListener('mousemove', (e) => {
        console.log('listener');
        position.x = e.clientX;
        position.cOffsetLeft = canvas.offsetLeft;
        
        //socket.emit('mousemove', position);

    });

    socket.emit('newBat');
    setInterval(function() {
        socket.emit('mousemove', position);
        }, 1000 / 60);


//}); //DOMContentLoaded