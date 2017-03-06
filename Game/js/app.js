var socket = io();

var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cmdP1 = 
{
    id: 8080,
    cmd: null
};

var cmdP2 = 
{
    id: 9090,
    cmd: null
};

var serverData = {};

var mario;
var bola;
var player1;
var player2;
var scoreText;
var p1Score = 0;
var p2Score = 0;
var p1ScoreText;
var p2ScoreText;
var send = false;

setInterval(function(){
        send = true;  
}, 1/40);

//LOAD IMAGES
function preload() {
    game.load.image('mario', '../Game/assets/mario.png');
    game.load.image('bola', '../Game/assets/Bola.png');
    game.load.image('background', '../Game/assets/background.png');
    game.load.image('player1', '../Game/assets/paleta.png');
    game.load.image('player2', '../Game/assets/paleta.png');
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    background = game.add.sprite(0, 0, 'background');
    bola = game.add.sprite(400, 250, 'bola');
    game.physics.enable(bola, Phaser.Physics.ARCADE);
    bola.body.collideWorldBounds = true;
    bola.body.velocity.setTo(200,150);
    bola.body.bounce.set(1.1);
    player1 = game.add.sprite(30, 200, 'player1');
    player2 = game.add.sprite(750, 200, 'player2');
    game.physics.enable(player1, Phaser.Physics.ARCADE);
    game.physics.enable(player2, Phaser.Physics.ARCADE);
    player1.body.immovable = true;
    player2.body.immovable = true;
    //game.scale.pageAlignVertically = true;
    //game.scale.pageAlignHorizontally = true;
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();
    socket.emit('start', '');
    socket.on('start', function (data) {
        player1.x = data.x1;
        player1.y = data.y1;
        player2.x = data.x2;
        player2.y = data.y2;
    });
    p1ScoreText = game.add.text(200, 80, "0", { font: "65px Adore64", fill: "#ffffff", align: "center" });
    p2ScoreText = game.add.text(600, 80, "0", { font: "65px Adore64", fill: "#ffffff", align: "center" });
}

function update() {
    game.physics.arcade.collide(player1, bola);
    game.physics.arcade.collide(player2, bola);
    
    player1.y = serverData.y1;
    player1.x = serverData.x1;
    player2.y = serverData.y2;
    player2.x = serverData.x2;
    
    
    if(bola.x >= 780 || bola.x == 0)
    {
        if(bola.x >= 780)
        {
            p1Score += 1;
            p1ScoreText.setText(p1Score);
        }
        if(bola.x == 0)
        {
            p2Score += 1;
            p2ScoreText.setText(p2Score);
        }
        bola.body.velocity.x = 200;
        bola.body.velocity.y = 150;
        bola.x = 400;
        bola.y = 250;
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        cmdP1.cmd = 'up';
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN))
    {
        cmdP1.cmd = 'down';
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.W))
    {
        cmdP2.cmd = 'up';
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.S))
    {
        cmdP2.cmd = 'down';
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.P))
    {
         game.pause = true; 
    }
    if(send)
    {
        socket.emit('event', cmdP1); 
        socket.emit('event', cmdP2); 
    }
    cmdP1.cmd = null;
    cmdP2.cmd = null;
}

socket.on('update', function (data) {
    serverData = data;
});