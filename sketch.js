/*

- Copy your game project code into this file
- for the p5.Sound library look here https://p5js.org/reference/#/libraries/p5.sound
- for finding cool sounds perhaps look here
https://freesound.org/


*/

var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;

var isFound;

var clouds;
var mountains;
var trees_x;
var collectables;
var canyons;

var game_score;
var flagpole;
var lives;

var platforms;
var enemies;

var jumpSound;
var fallSound;
var coinSound;
var flagpoleSound;
var backgroundMusic;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
}


function setup()
{
	createCanvas(1024, 576);

    floorPos_y = height * 3/4;
    lives = 3;
    startGame();  
}


function draw()
{
	background(100, 155, 255); // fill the sky blue

	noStroke();
	fill(0,155,0);
	rect(0, floorPos_y, width, height/4); // draw some green ground

    push();
    translate(scrollPos, 0);

  
	// Draw clouds.

    drawClouds();
    
	// Draw mountains.
    
    drawMountains();

	// Draw trees.
    
    drawTrees();
    
	// Draw canyons.
        
    for(var i = 0; i < canyons.length; i++)
    {
        drawCanyon(canyons[i]);
        checkCanyon(canyons[i]);
    }

	// Draw collectable items.
    
    for(var i = 0; i < collectables.length; i++)
    {
        if(!collectables[i].isFound)
        {
            drawCollectable(collectables[i]);
            checkCollectable(collectables[i]);
        }
//        if(collectables[i].isFound == false)
//        {
//            drawCollectable(collectables[i]);
//            checkCollectable(collectables[i]);
//        }
//        else if (collectables[i].isFound == true)
//        {
//            
//        }
    }

    //Draw platforms.

    for(var i = 0; i < platforms.length; i++)
    {
        platforms[i].draw();
    }
        

    renderFlagpole();
    
    pop();



	// Draw game character.
	
	drawGameChar();
    
    
    // Draw "game over" when gameChar dies
    
    if(lives < 1)
    {
        fill(231, 111, 81);
        textSize(25);
        text("Game over. Press space to continue.", width/2, height/2);
        return;
    }
    
    // Draw "level complete" when the flagpole is reached

    if(flagpole.isReached == true)
    {
        fill(231, 111, 81);
        textSize(25);
        text("Level complete. Press space to continue.", width/2, height/2);
        return;
    }
    
    //Draw game score
    
    fill(255);
    noStroke();
    textSize(20);
    text("Score: " + game_score, 20, 30);
    
    //Draw lives
    
    fill(255);
    noStroke();
    textSize(20);
    text("Lives: " + lives, 140, 30);


    

	// Logic to make the game character move or the background scroll.
    
	if(isLeft)
	{
		if(gameChar_x > width * 0.2)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5;
		}
	}

	if(isRight)
	{
		if(gameChar_x < width * 0.8)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
		}
	}


	// Logic to make the game character rise and fall.

    if(gameChar_y < floorPos_y)
    {
        var isContact = false;  
        for(var i = 0; i < platforms.length; i++)
        {
            if(platforms[i].checkContact(gameChar_world_x, gameChar_y) == true)
            {
                isContact = true;
                break;     
            }
        }
        if(isContact == false)
        {
            gameChar_y += 2;
            isFalling = true;
        }
    }
    else
    {
        isFalling = false;
    }
    if(isPlummeting)
    {
        gameChar_y += 10;
    }
    // if(isFalling == true && gameChar_y < floorPos_y)
    // {
    //     gameChar_y -= 5 ;
    // }
    // else if(isFalling == false && gameChar_y < floorPos_y)
    // {
    //     gameChar_y += 10;
    // }
    
    // Check if gameChar reached the flagpole
    
    if(flagpole.isReached == false)
    {
        checkFlagpole();
    }
    
    // Reset gameChar's position when it falls
    checkPlayerDie();
    
	// Update real position of gameChar for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;
}


// ---------------------
// Key control functions
// ---------------------

function keyPressed()
{

    if(keyCode == 37)
        {
            //console.log("left arrow");
            isLeft = true;
        }
    else if(keyCode == 39)
        {
            //console.log("right arrow");
            isRight = true;
        }
    
    //jumping
    if(keyCode == 32 && gameChar_y >= floorPos_y)
        {
            //console.log("space-bar");
            gameChar_y -= 100;
            isFalling = true;
            jumpSound.play();
        } 
    
    
    if(keyCode == 32 && flagpole.isReached == true)
    {
        startGame();
    }
    
    if(keyCode == 32 && lives <= 0)
    {
        startGame();
        lives = 3;
    }
}

function keyReleased()
{
	console.log("release" + keyCode);
	console.log("release" + key);

    if(keyCode == 37)
        {
            console.log("left arrow");
            isLeft = false;
        }
    else if(keyCode == 39)
        {
            console.log("right arrow");
            isRight = false;
        }
    
    //jumping
    else if(keyCode == 32)
        {
            console.log("space-bar");
            isFalling = false;
        }
}

// ------------------------------
// Game start function
// ------------------------------

function startGame()
{
	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;

	// Variable to store the real position of the gameChar in the game
	// world. Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;

	// Initialise arrays of scenery objects.
    trees_x = [100,350,600,1000,1500,1800,2050,2500,3500,4010];
    clouds = [
        {x_pos: 100, y_pos: 100, scale: 1.0},
        {x_pos: 500, y_pos: 80, scale: 1.0},
        {x_pos: 700, y_pos: 100, scale: 1.0},
        {x_pos: 900, y_pos: 90, scale: 1.0},
        {x_pos: 1300, y_pos: 200, scale: 1.0},
        {x_pos: 1800, y_pos: 105, scale: 1.0},
        {x_pos: 2000, y_pos: 150, scale: 1.0},
        {x_pos: 2300, y_pos: 105, scale: 1.0},
        {x_pos: 2500, y_pos: 80, scale: 1.0},
        {x_pos: 3000, y_pos: 150, scale: 1.0},
        {x_pos: 4500, y_pos: 200, scale: 1.0}
    ];
    mountains = [
        {x_pos: 350, y_pos: floorPos_y},
        {x_pos: 850, y_pos: floorPos_y},
        {x_pos: 1050, y_pos: floorPos_y},
        {x_pos: 1550, y_pos: floorPos_y},
        {x_pos: 2550, y_pos: floorPos_y},
        {x_pos: 3050, y_pos: floorPos_y},
        {x_pos: 3550, y_pos: floorPos_y},
        {x_pos: 4010, y_pos: floorPos_y},
        {x_pos: 4300, y_pos: floorPos_y},
        {x_pos: 5050, y_pos: floorPos_y}
    ];
    canyons = [
        {x_pos: 100, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 1210, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 1800, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 2100, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 2700, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 3790, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 4500, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 4800, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 5500, y_pos: floorPos_y, width: 100, height: 144},
        {x_pos: 5900, y_pos: floorPos_y, width: 100, height: 144},
    ];
    collectables = [
        {x_pos: 100, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 400, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 700, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 900, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 1900, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 2500, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 2900, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 3500, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 4500, y_pos: floorPos_y - 40, size: 50, isFound: false},
        {x_pos: 5100, y_pos: floorPos_y - 40, size: 50, isFound: false}
    ];
    
    platforms = [];
    
    platforms.push(createPlatforms(100,floorPos_y - 100,100));
    platforms.push(createPlatforms(400, floorPos_y - 100, 200));
    
    game_score = 0; 
    
    flagpole = {isReached: false, x_pos: 1500};

    enemies = [];
    enemies.push(new Enemy(100, floorPos_y - 10, 100, 100))
}


function checkPlayerDie()
{
    if (gameChar_y - 20 > height)
    {
        lives -= 1;
        if(lives > 0)
   
        {
            startGame();
        }
    }
}

// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar()
{
	// draw game character
    noStroke();
	if(isLeft && isFalling)
	{
		// add your jumping-left code
        //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,20)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y -50,30,30)
        //left foot
        fill(143, 45, 86)
        ellipse(gameChar_x - 10,gameChar_y -16,8,10)
        //arms
        fill(233, 175, 163)
        //left arm
        rect(gameChar_x - 22,gameChar_y - 35,12,8,4)

	}
	else if(isRight && isFalling)
	{
		// add your jumping-right code
        //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,20)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y - 50,30,30)
        //right foot
        fill(143, 45, 86)
        ellipse(gameChar_x + 10,gameChar_y -16,8,10)
        //right arm
        fill(233, 175, 163)
        rect(gameChar_x + 10,gameChar_y - 35,12,8,4)

	}
	else if(isLeft)
	{
		// add your walking left code
        //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,30)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y -50,30,30)
        //left foot
        fill(143, 45, 86)
        ellipse(gameChar_x - 10,gameChar_y -6,8,10)

	}
	else if(isRight)
	{
		// add your walking right code
        //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,30)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y -50,30,30)
        //right foot
        fill(143, 45, 86)
        ellipse(gameChar_x + 10,gameChar_y -6,8,10)


	}
	else if(isFalling || isPlummeting)
	{
		// add your jumping facing forwards code
        //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,20)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y -50,30,30)
        //feet
        fill(143, 45, 86)
        //left foot
        ellipse(gameChar_x - 10,gameChar_y -16,8,10)
        //right foot
        ellipse(gameChar_x + 10,gameChar_y -16,8,10)
        //arms
        fill(233, 175, 163)
        //left arm
        rect(gameChar_x - 22,gameChar_y - 35,12,8,4)
        //right arm
        rect(gameChar_x + 10,gameChar_y - 35,12,8,4)

	}
	else
	{
		// add your standing front facing code
       //body
        fill(60, 110, 113)
        rect(gameChar_x -12,gameChar_y - 38,24,30)
        //head
        fill(233, 175, 163);
        ellipse(gameChar_x, gameChar_y -50,30,30)
        //left foot
        fill(143, 45, 86)
        ellipse(gameChar_x - 10,gameChar_y -6,8,10)
        //right foot
        ellipse(gameChar_x + 10,gameChar_y -6,8,10)

    }
}

// ---------------------------
// Background render functions
// ---------------------------


// Function to draw cloud objects.

function drawClouds()
{
    for(var i = 0; i < clouds.length; i++)
    {
        fill(255);
        ellipse(
                clouds[i].x_pos + 100 * clouds[i].scale,
                clouds[i].y_pos + 50,
                clouds[i].scale * 80,
                clouds[i].scale * 80);
        ellipse(
                clouds[i].x_pos + 60 * clouds[i].scale,
                clouds[i].y_pos + 50,
                clouds[i].scale * 60,
                clouds[i].scale * 60);
        ellipse(
                clouds[i].x_pos + 140 * clouds[i].scale,
                clouds[i].y_pos + 50,
                clouds[i].scale * 60,
                clouds[i].scale * 60);
    }
}


// Function to draw mountains objects.

function drawMountains()
{
    for(var i = 0; i < mountains.length; i++)
    {
        //bottom gray
        fill(128,128,128);
        triangle(
                mountains[i].x_pos,
                mountains[i].y_pos,
                mountains[i].x_pos + 250,
                mountains[i].y_pos,
                mountains[i].x_pos + 125,
                mountains[i].y_pos - 232);
        //top white
        fill(255,255,255);
        triangle(
                mountains[i].x_pos + 125,mountains[i].y_pos - 232,
                mountains[i].x_pos + 82,mountains[i].y_pos - 152,
                mountains[i].x_pos + 168,mountains[i].y_pos - 152);
    }
}

// Function to draw trees objects.

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        //brown trunk
        fill(120,100,40);
        rect(trees_x[i],floorPos_y - 150,60,150);
        //green branches
        fill(0,155,0);
        triangle(
                trees_x[i] - 50, floorPos_y - 100, 
                trees_x[i] +30, floorPos_y - 200, 
                trees_x[i] + 110, floorPos_y - 100);
        triangle(
                trees_x[i] - 50, floorPos_y - 52, 
                trees_x[i] + 30, floorPos_y - 150, 
                trees_x[i] + 110, floorPos_y - 52);
    }
}


// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function to draw canyon objects.

function drawCanyon(t_canyon)
{
        fill(178, 150, 125);
        //canyon left part
        rect(t_canyon.x_pos + 100, t_canyon.y_pos, 10, t_canyon.height)
        //canyon right part
        rect(t_canyon.x_pos + t_canyon.width + 100, t_canyon.y_pos, 10, t_canyon.height)
        //canyon middle part
        fill(100, 155, 255)
        rect(t_canyon.x_pos + 110, t_canyon.y_pos, t_canyon.width - 10, t_canyon.height)
            
        //canyon bottom
         fill(86, 82, 100)
        //left triangle
        triangle(
                t_canyon.x_pos + 110, 
                t_canyon.y_pos + 144, 
                t_canyon.x_pos + t_canyon.width/2 + 105, 
                t_canyon.y_pos + 144, 
                t_canyon.x_pos + t_canyon.width/4 + 107.5, 
                t_canyon.y_pos + 118)
        //right triangle
        triangle(
                t_canyon.x_pos + t_canyon.width/2 - 5 + 110, 
                t_canyon.y_pos + 144, 
                t_canyon.x_pos + t_canyon.width + 100, 
                t_canyon.y_pos + 144, 
                t_canyon.x_pos + t_canyon.width * 3/4 + 102.5, 
                t_canyon.y_pos + 118)
}

// Function to check character is over a canyon.

function checkCanyon(t_canyon)
{
    if(gameChar_world_x > t_canyon.x_pos + 100 && 
       gameChar_world_x < t_canyon.x_pos + t_canyon.width + 100 && 
       gameChar_y >= floorPos_y)
       {
           isPlummeting = true;
       }
    if(isPlummeting == true)
       {
           gameChar_y += 1;
       }
    
}


// ----------------------------------
// Flagpole render and check functions
// ----------------------------------

function renderFlagpole()
{
    push(); 
    
    //pole
    strokeWeight(5);
    stroke(100);
    line(flagpole.x_pos, floorPos_y, flagpole.x_pos, floorPos_y - 250 );
    
    //flag
    noStroke();
    fill(255, 173, 173)

    if(flagpole.isReached) 
    {
        rect(flagpole.x_pos, floorPos_y - 250, 50, 50)
    }
    else
    {
        rect(flagpole.x_pos, floorPos_y - 50, 50, 50)
    }
        
    pop();

}

function checkFlagpole()
{
    //d for distance
    var d = abs(gameChar_world_x - flagpole.x_pos);
    
    if(d < 15)
    {
        flagpole.isReached = true;
    }
    
}


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(t_collectable)
{
        fill(240, 113, 103);
        stroke(109, 104, 117);
        strokeWeight(1);
        //big circle
        ellipse(t_collectable.x_pos, t_collectable.y_pos, t_collectable.size);
        //small circle
        ellipse(t_collectable.x_pos,t_collectable.y_pos, t_collectable.size*0.8);
        //letter
        textFont('arial');
        textSize(t_collectable.size*0.5);
        textStyle(BOLD);
        fill(109, 104, 117);
        text('B', t_collectable.x_pos - 9*t_collectable.size/50, t_collectable.y_pos + 8*t_collectable.size/50);
}

// Function to check character has collected an item.

function checkCollectable(t_collectable)
{
    //check if the gameChar is intersecting with t_collectable
    if(dist(gameChar_world_x, gameChar_y, t_collectable.x_pos, t_collectable.y_pos) < 50)
    {
        t_collectable.isFound = true;
        console.log('yay');
        game_score += 1;
    }
}


function createPlatforms(x, y, length)
{
    var p = 
    {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(255,0,255);
            rect(this.x, this.y, this.length, 20);
        },
        checkContact: function(gc_x, gc_y)
        {
            if(gc_x > this.x && gc_x < this.x + this.length)
            {
                var d = this.y - gc_y;
                if( d >= 0 && d < 5)
                {
                    return true;
                }
            }
            return false;
        }
    }
    return p;
}

function Enemy(x, y, range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    //inc is increment
    this.inc = 1;

    this.update = function()
    {
        this.currentX += this.inc;

        if(this.currentX >= this.x + this.range)
        {
            this.inc = -1;
        }
        //make enemy to move back the other way
        else if(this.currentX <= this.x)
        {
            this.inc = 1;
        }
    }

    this.draw = function()
    {
        this.update();
        fill(255,0,0)
        ellipse(this.x, this.y, 20, 20);
    }

    this.checkContact = function()
    {

    }
}