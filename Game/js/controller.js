//Initializes SocketIO
var socket = io();
//Initializes Phaser
var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var b_up;
var b_down;
var pad;
var cmd_up_trigger = false;
var cmd_down_trigger = false;
var cmd;

var cmdP1 = 
{
    id: 8080,
    cmd: null
};

function preload() {
    game.load.image('up', '../Game/assets/ButtonUp.png');
    game.load.image('down', '../Game/assets/ButtonDown.png');
    game.load.image('background', '../Game/assets/bg.jpg');
}

function create() {
    background = game.add.sprite(0, 0, 'background');
    b_up = game.add.sprite(50, 100, 'up');
    b_down = game.add.sprite(300, 100, 'down');
    
    b_up.inputEnabled = true;
    b_down.inputEnabled = true;
    
    b_up.events.onInputDown.add(pressUp, this);
    b_down.events.onInputDown.add(pressDown, this);
    b_up.events.onInputUp.add(pressUp, this);
    b_down.events.onInputUp.add(pressDown, this);
    
    game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
    game.scale.refresh();
}

function update() {
    if(cmd_up_trigger == true)
    {
        cmdP1.cmd = 'up';
    }
    if(cmd_down_trigger == true)
    {
        cmdP1.cmd = 'down';
    }
    socket.emit('event', cmdP1);
    cmdP1.cmd = null;
}

function pressUp() {
    if(cmd_up_trigger == true)
    {
        cmd_up_trigger = false;
    }
    else
    {
         cmd_up_trigger = true;
    }
}

function pressDown()
{
    if(cmd_down_trigger == true)
    {
        cmd_down_trigger = false;
    }
    else
    {
         cmd_down_trigger = true;
    }
}