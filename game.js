let gamePiece, fuel = 300, burningFuel = false, burnTrigger = false;
let gamePieceSprite, spriteCount = 0;
let gameObstacle = [], obstacleSave = [], obsX, obsY, obsH, obsN= 0, id = 0;
let gameScore, pointTotal, highScore, localStore;
let paused;
let optionA, optionB, optionC;
const up = document.getElementById("up"), down = document.getElementById("down"), 
    left = document.getElementById("left"), right = document.getElementById("right"), 
    center = document.getElementById("center");
let count = 0;
let secondsPassed = 0, oldTimeStamp = 0, fps;
let finishLine;
let obstacleSpeed = 2, intervalRate = 250 / obstacleSpeed;
let speedInterval;
let obsPosition;
let countBy = 1;
let opponents = [], opponent = [], opponentSpeed = 50, dodgeSpeed = 0, opponentAvatar = [],
	opp, oppX, oppY, oppW, oppH;
let playerName;
let position = 0, positionDisplay, playerPosition, playerPositionNo,
	allPositions = [90], checkPosition = false, positionChecked = false,
	positionColor = [
	'', 'violet', 'teal','green', 'turquoise',
	'olive', 'lime', 'peach', 'maroon', 'pink',
	'silver', 'black', 'white', 'purple', 'magenta',
	'blue', 'yellow', 'orange', 'red'
	]; //ADD 'cyan' IF YOU EVER CHANGE BACKGROUND COLOR
let avatar, pickedCount= 19;
let bar, progress;

//SAVE GAME SCORES TO LOCAL-STORAGE
if(typeof(Storage)!=="undefined"){
	 if(localStorage.points) {
         localStore = JSON.parse(localStorage.getItem("points") );  
       } else {
        localStore = 0;
     };
     if(localStorage.score) {
     	highScore = JSON.parse(localStorage.getItem("score") );
     } else {
     	highScore = 0;
     };
   }else {
        alert("localStorage not available, change browser to make game accessible game offline");
 };

 
//PRELOAD GAME ASSETS
preload = function() {
	img1 = [];
	img2 = [];
	img3 = [];

	for(let i = 0;  i < 15; i++) {
    	// img1[i] = new Image();
    	img1[i] = `Star-Bug/png/skeleton-animation_${i}.png`;
    };
    
    for(let i = 0;  i < 15; i++) {
    	// img2[i] = new Image();
    	img2[i] = `Purple-Bug/png/skeleton-animation_${i}.png`;
    };
    
    for(let i = 0;  i < 11; i++) {
    	// img3[i] = new Image();
    	img3[i] = `Flappy-Box/png/skeleton-animation_${i}.png`; 
	};
	startGame();
 };


//SHUFFLE AND ADD OPPONENTS AVATAR AND FEATURES
function loadOpponents() {
	let x = 120;
	const minY = 50;
	const maxY = 220;
	const minN = 0;
	const maxN = 2;
	avatar = [ img1, img2, img3 ];
	const names = [
		"killer", "baba", "leo", "shittu", "lion",
		"pleasse", "kate", "maine", "mr-money", "og",
		"bintu", "alaye", "boss", "no-1", "them",
		"file-funn", "alayeTosheGogo", "glock-9", "pablo", "nathaniel"
	];
	
	for (i = 0; i < 17; i ++) {
		const name0 = 0;
		const name20 = pickedCount;
		let y = 
			Math.floor(Math.random() * (maxY - minY + 1) + minY);
		let N =
			Math.floor(Math.random() * (maxN - minN + 1) + minN);
		let name =
			Math.floor(Math.random() * (name20 - name0 + 1) + name0);
		opponents[i] = {
			y: y,
			images: avatar[N],
			limit: avatar[N].length,
			name: names[name],
			x: x,
			count: 0,
			accelerateStartTime: 200,
			accelerateEndTime: 600,
			accelerateTime: 0,
			accelerateValue: 0,
			checkAccelerate: false,
			checkDetect: false,
			positionPoint: 0,
			position: i,
			animate: () => {

			}
		};
		x += 120;
		names.splice(name, 1)
		pickedCount--;
	};
};


//ANIMATE OPPONENTS
const animateOpponents = () => {
	
	for (i = 0; i < opponent.length; i++) {

		if(opponents[i].checkAccelerate) {
			opponent[i].image.src = opponents[i].images[opponents[i].count];
			opponents[i].count+= 2;

			if(opponents[i].count + 1 >= opponents[i].limit) {
				opponents[i].count = 0;
			};
		} else {
			opponent[i].image.src = opponents[i].images[opponents[i].count];
			opponents[i].count++;

			if(opponents[i].count === opponents[i].limit) {
				opponents[i].count = 0;
			};
		};
	};
};


//ASSIGN NEW COMPONENTS TO VARIABLES AND CALL LOADINDEX()
startGame = function() {
	gamePiece = new component(80, 32, img1[0] , 10, 119, "image");
	gameScore = new component("20px", "Consolas", "black", 210, 100, "text");
	bar = new component(370, 5, "white", 55, 40);
	progress = new component(300, 1, "", 60, 42);
	finishLine =  new component(20, 270, "blue", 19330, 0);//x is ( (480 - 200) * obsN ) + 480 + (10 * obsN)
	playerName = new component("17px", "Consolas", 'black' , 0, 0, "text");
	positionDisplay = new component("20px", "Consolas", "white", 210, 40, "text");
    points = new component("20px", "Consolas", "black", 70, 28, "text");
    playerPosition = new component("20px", "Consolas", "black", 70, 28, "text");
    score = new component("20px", "Consolas", "white", 270, 28, "text");
    paused = new component(105, 70, "play.png", 180, 90, "image");
    optionA = new component("35px", "Cursive", "black", 133, 152, "text");
    optionB = new component("35px", "Cursive", "black", 173, 200, "text");
    optionC = new component("35px", "Cursive", "black", 193, 248, "text");
    gameField.loadIndex();
}


//GAMEFIELD OBJECT
const gameField = {
	canvas :
	document.createElement("canvas"),
	
	loadIndex : function() {
	this.canvas.width = 480;
	this.canvas.height = 270;
	this.context =
	this.canvas.getContext("2d");
	this.frameNo = 0;
	updateIndex();
	startClick();
	document.getElementById("canvas"). appendChild(this.canvas);
     },

	start : function() {
		loadOpponents();
		this.setZoomSize();
		this.zoomInterval = 
			setInterval(zoom, 8);
		endClick();
		startControl();
		center.ondblclick = pause;
		this.runNo = 0;
		this.runInterval =
		  setInterval(run, 2500);
        window.requestAnimationFrame(updateField);
	},
	
	finish: function() {
		gameField.canvas.style.backgroundImage =
 "url(' '), url('gameover.png '), url('Gem Orange.png'), url('Gem Green.png '), url(' ')";
       navigator.vibrate(80);
       
	   gamePiece.x -= 3;
	   gamePiece.explode();
		updatePoints();
		this.stopRun();
		clearMove();
		endControl();
		center.ondblclick = " ";
	   setTimeout(updateFinish, 40);
      },
      
    toggleFullScreen : function() {
        const game = document.getElementById("game");
        if (!document.fullscreenElement){
           game.requestFullscreen();           
           game.removeChild(document.getElementById("screen"));
           game.removeChild(document.getElementById("title"));
           game.removeChild(document.getElementById("interact"));
           game.appendChild(gameField.canvas);
           this.canvas.style.minHeight = "100%";
           this.canvas.style.height = "100%";
           this.canvas.style.minWidth = "100%";
           this.canvas.style.width = "100%";
           this.canvas.height = 480;
           this.canvas.width = 270;
           localStorage.setItem("oldX", JSON.stringify(this.x) );
           localStorage.setItem("oldY", JSON.stringify(this.y) );
           
           this.x = localY;
           this.y = localX;
           
          
           gamePiece.rotateUpdate();
           
           this.clearOption();
           optionA.choose();
           optionB.text = "Exit Screen";
           optionB.unChoose();         
           showOptions();
           
          } else {
           document.exitFullscreen();
           this.clearOption();
           optionA.choose();
           optionB.text = "Full Screen";
           optionB.unChoose();
           showOptions();
           
         };
    },
	
	reset : function() {
		gamePiece.x = 10;
		gamePiece.y = 120;
		gamePiece2.x = 160;
		gamePiece2.y = 100;
		gamePiece.image.src = "airship.png";
		gamePiece.width = 80;
		gamePiece.height = 32;
		gameObstacle= [];
		localStore = JSON.parse(localStorage.getItem("points") );
		highScore = JSON.parse(localStorage.getItem("score") );
	},
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	clearOption : function() {
		this.context.clearRect(130, 115, 310, 137);
	},
	
	stop : function() {
		clearInterval(this.interval);
	},
	
	stopRun: function() {
		clearInterval(this.runInterval);
	},

	setZoomSize: function() {
		this.canvas.width+= 1520;
		this.canvas.height+= 1520;
		gamePiece.y+= 1520/2;
	},

	checkZoomClear: false,

	clearZoomInterval: function() {
		if(!this.checkZoomClear) {
			clearInterval(this.zoomInterval);
			gameField.canvas.width = 480;
			gameField.canvas.height = 270;
			gamePiece.y = 119;
			this.checkZoomClear = true;
		};
	}

}

function component(width, height, color, x, y, type) {
	this.type = type;
	this.color = color;
	if (type == "image") {
        this.image = new Image();
        this.image.src = this.color;
    }
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = gameField.context;
		
		if(this.type == "image") {
			
			ctx.drawImage(this.image,
             this.x,
             this.y,
             this.width, this.height);
          } else if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y);
		  } else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
	  }
	}
	let rotated = false;
	this.rotateUpdate = function() {
		if(rotated == !true) {
			ctx.translate( this.x+this.width/2, this.y+this.height/2 );
           ctx.rotate( Math.PI/2 );
           ctx.translate( -this.x-this.width/2, -this.y-this.height/2 );
           rotated = true;
           console.log("1", rotated);
        } else if (rotated == true){
        	this.rotateUpdate = this.update;
             console.log("2", rotated);
        };
    }
    
    this.move = function(accelerate) {
    	this.speedX = opponentSpeed + accelerate;
    	this.speedY = dodgeSpeed;
    }

    //NEEDS FIXING
    let checked = false;
    this.checkPosition = function(name) {
    	if(checked == false && this.x + this.width >= finishLine.x) {
    	   position += 1;
           checked = true;
        };
    }
    
    this.namePlayer = function(name, color) {
    	playerName.text = name;
        if(name.length == 1) {
        	playerName.x = this.x + 42;
        } else if(name.length > 1){
        	playerName.x = this.x + 42 - ((name.length - 1) * 5);
        };
        playerName.y = this.y - 3;
        playerName.color = color;
        playerName.update();
        
        if(checked == false && this.x + this.width >= finishLine.x) {
    	   position += 1;
           
           opponentSpeed = 0;
           this.obsPos();
           checked = true;
           positionDisplay.text = "No " + position + ": " + name;
        };
    }

    // this.updateColor = function() {
    // 	this.playerName.color = positionColor[this.position];
    // }
	
	
	this.animate = function() {
		this.image.src = img1[count];
		count+= countBy;
		if(count > 14) {
			count = 0;
		};
	}

	
	this.explode = function() {
		this.image.src = "explode.png";
		this.width = 190;
		this.height = 100;
	}
	
	this.choose = function() {
		this.width = "50px";
		this.color = "white";
	}
	
	this.unChoose = function() {
		this.width = "35px";
		this.color = "black";
	}
	
	this.followPos = function() {
		//vertical chase
		if(this.y + 30 < gamePiece.y) {
			this.y += 0.25;
		} else if(this.y + 30 == gamePiece.y) {
			this.y += 0;
		} else if(this.y + 30 > gamePiece.y) {
			this.y -= 0.25;
		}
		
		//horizontal chase
		if(this.x < gamePiece.x - 5) {
			this.x += 0.25;
		} else if (this.x == gamePiece.x -5) {
			this.x += 0;
		} else if (this.x > gamePiece.x -5) {
			this.x -= 1.25;
		}
		
		if(this.y + 32 == gamePiece.y && this.x == gamePiece.x) {
			
		}
		
	}
	
	this.disableEscapeScreen = function() {
		if(this.y > 240) {
			this.y = 240;
		} else if(this.y < 0) {
			this.y = 0;
       };
	}
	
	this.newPos = function(secondsPassed) {
		this.x += (this.speedX * secondsPassed );
		this.y += (this.speedY * secondsPassed);
	}

	this.newPro = function(secondsPassed) {
		this.width = fuel * 1.2;
		if(this.width > 350) {
			this.color = "green";
		} else if(this.width < 350 && this.width > 180) {
			this.color = "#0fb71d";
		} else if(this.width < 180 && this.width > 80) {
			this.color = "#54d254";
		} else if (this.width < 80 && this.width > 70) {
			this.color = "#9baf17";
		} else if(this.width < 70 && this.width > 35) {
			this.color = "red";
		} else{
			this.color = "#b90a0a";
		};
	}
	
	this.obsPos = function() {
		this.x += (this.speedX * obstacleSpeed);
		this.y += (this.speedY * obstacleSpeed);
	}
	
	this.crashWith =
	function(otherobj) {
		let myLeft = this.x;
		let myRight = this.x + (this.width) -2;
		let myTop = this.y + 5;
		let myBottom = this.y + (this.height);
		let otherLeft = otherobj.x;
		let otherRight = otherobj.x + (otherobj.width);
		let otherTop = otherobj.y;
		let otherBottom = otherobj.y + (otherobj.height);
		let crash = true;

		if ((myBottom < otherTop) ||
		 (myTop > otherBottom) ||
		 (myRight < otherLeft) ||
	     (myLeft > otherRight)) {
			crash = false;
		}
		return crash;
	}
}



function updateIndex() {
	optionA.text = "Play Game";
	if (!document.fullscreenElement) {
	    optionB.text = "Full Screen";
	} else {
		optionB.text = "Exit Screen";
	}
	optionC.text = "Exit";
	optionA.choose();
	showOptions();
}

function showOptions() {
	optionA.update();
	optionB.update();
	optionC.update();
}

function updatePoints() {
	localStorage.setItem("points", JSON.stringify(pointTotal) );
	if(gameField.runNo > highScore) {
		localStorage.setItem("score", JSON.stringify(gameField.runNo) );
	};
}


function updateFinish() {
	gameField.stop();
	setTimeout(() => {
		gameField.clear();
		gameScore.text = "+ " + gameField.runNo;
		gameScore.update();
		gameField.canvas.style.backgroundImage = "url('spaceshipexplode.gif'), url(''), url('Gem Orange.png'), url(' Gem Green.png'), url('')";
	    optionA.text = "Restart";
	    optionC.text = "Home";
	    showOptions();
	    setTimeout(startClick, 150); 
	}, 440);
}



function run() {
	gameField.runNo += 10;
};

const zoom = () => {
	gameField.canvas.width-= 10;
	gameField.canvas.height-= 10;
	gamePiece.y-= 10;
};

const burnFuel = () => {
	if(!burningFuel && fuel <  300) {
		fuel+= 5;
		if(fuel + 5 >= 300) {
			fuel = 300;
			if (burnTrigger) {
				moveRight();
			}
		}
	} else if(burningFuel && fuel > 0 ){
		fuel--;
		if(fuel === 0) {
			burningFuel = false;
			countBy = 1;
		   	obstacleSpeed = 2;
		   	opponentSpeed = 50;
		}
	};
	
}


//UPDATE GAMEFIELD
const updateField = (timeStamp) => {
	secondsPassed = (timeStamp - oldTimeStamp) / 1000  ;
	secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;
    
    fps = Math.round(1 / secondsPassed);
     
    
	let x, height, gap, minHeight, maxHeight, minY, maxY, minGap, maxGap, minDelay, maxDelay;
	for (i = 0; i < gameObstacle.length; i += 1) {
		if (gamePiece.crashWith(gameObstacle[i])) {
			//gameField.finish();
		}
	}
	gameField.clear();
	gameField.frameNo += 1;
	
	
	//CREATE OBSTACLES
	if (gameField.frameNo  === 1 ) {
		x = gameField.canvas.width;
		minDelay = 0;
		maxDelay = 5;
		delay =
		Math.floor(Math.random() * (maxDelay - minDelay + 1) + minDelay);
		minHeight = 37.5;
		maxHeight = 75;
		height =
		Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
		minY = 0;
		maxY = 40;
		y =
		Math.floor(Math.random() * (maxY - minY + 1) + minY);
		minGap = 35;
		maxGap = 151;
		gap =
		Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
		
		
		gameObstacle.push(new component(10, height, "yellow", x + delay, y));
		gameObstacle.push(new component(10, height, "yellow", x + delay, y + height + gap));
		gameObstacle.push(new component(10, height , "yellow", x + delay, y + height + gap + height + gap));
		gameObstacle.push(new component(10, height , "yellow", x + delay, y + height + gap + height + gap + height + gap ));
	

		obstacleSave.push(id, gameObstacle)
		id++;
		obsN++;
	}

	let aaa = false;

	//MOVE OBSTACLES
	for (i = 0; i < gameObstacle.length; i++) {
		gameObstacle[i].speedX = -1;
		gameObstacle[i].obsPos();
		gameObstacle[i].update();
		obsPosition = gameObstacle[i].x;

		//ASSIGNING OBSTACLES PROPERTIES TO VARIABLES
		// if(!obstacleSave.includes(id)) {
		// 	console.log(obstacleSave)
		// } else {
		// 	console.log('none')
		// }
		
	}

	//MAKE OPPONENTS AVOID OBSTACLES
	for (i = 0; i < opponent.length; i++) {
		// if(gameObstacle[i] !== undefined) {
		// 	oppX = opponent[i].x;
		// 	oppY = opponent[i].y;
		// 	oppH = opponent[i].height;
		// 	oppW = opponent[i].width;
		// 	obsX = gameObstacle[i].x;
		// 	obsY = gameObstacle[i].y;
		// 	obsH = gameObstacle[i].height;

		// 	if(
		// 		 (oppX + oppW < gameField.canvas.width && oppX + oppW + 100 >= obsX && obsX > oppX + oppW)
		// 	) {
		// 		console.log(i, ' run o')

		// 	} else {
		// 		console.log(1)
		// 		// console.log("add: ", oppX + oppW, "field: ", gameField.canvas.width )
		// 	}

		// 	// console.log("obsX: ", gameObstacle[i].x, "No: ", i)
		// } else {
		// 	// console.log('wo joor')
		// }
	}


	
	
    if(obsN <= 105) {
      if( obsPosition  <= 200) {
			gameField.frameNo  = 0;
			obsPosition = 480;
		
	  };
	};
  //if(obsN == 16) {
			//finishLine.speedX = -1;
            //finishLine.obsPos();
            //finishLine.update();
        //console.log("e don happen");
	//};
	
	//OPPONENTS UPDATE TO SCREEN
	for (i = 0; i < opponents.length; i++) {
		if(opponent[i] === undefined) {
			opponent[i] = new component(
				80, 32, opponents[i].images[0] , opponents[i].x , opponents[i].y, "image"
			);
			// opponent[i].animate = opponents[i].animate;
		} else {

			//RANDOM ACCELERATIONS
			opponents[i].accelerateTime++;

			opp = opponent[i];
			oppX = opponent[i].x;
			oppY = opponent[i].y;
			oppH = opponent[i].height;
			oppW = opponent[i].width;

			let minAV = 45;
			let maxAV = 65;
			let minDV = 0;
			let maxDV = 5;
			let minAST = 100;
			let maxAST = 300;
			let minAET = 350;
			let maxAET = 850;

			if(
				!opponents[i].checkAccelerate  &&
				opponents[i].accelerateTime >= opponents[i].accelerateStartTime
			) {
				opponents[i].accelerateValue = 
					Math.floor(Math.random() * (maxAV - minAV + 1) + minAV);

				opponents[i].accelerateStartTime = 
					Math.floor(Math.random() * (maxAST - minAST + 1) + minAST);

				opponents[i].accelerateEndTime = 
					Math.floor(Math.random() * (maxAET - minAET + 1) + minAET);

					opponents[i].checkAccelerate = true;
			} else if(
				opponents[i].checkAccelerate && 
				opponents[i].accelerateTime >= opponents[i].accelerateEndTime
			) {
				opponents[i].accelerateValue = 
					Math.floor(Math.random() * (maxDV - minDV + 1) + minDV);
				opponents[i].accelerateTime = 0;
				opponents[i].checkAccelerate = false;
			}


			opponent[i].namePlayer(opponents[i].name, positionColor[opp.position]);
			opponent[i].disableEscapeScreen();
			opponent[i].move(opponents[i].accelerateValue);
			opponent[i].newPos(secondsPassed);
			opponent[i].update();

			//DETECT POSITIONS
			if (positionChecked) {
				opp.positionPoint = oppX + oppW;
				allPositions = [gamePiece.x + gamePiece.width, opp.positionPoint];
				positionChecked = false;
				checkPosition = false;

			} else if(!checkPosition) {
				opp.positionPoint = oppX + oppW;
				allPositions.push(opp.positionPoint);

				if (i === opponents.length - 1) {
					allPositions.sort((a,b) => b - a);
					checkPosition = true;
				};

			} else if(checkPosition) {
				opp.position = allPositions.indexOf(opp.positionPoint) + 1;
				playerPositionNo = allPositions.indexOf(gamePiece.x + gamePiece.width) + 1;

				if (i === opponents.length - 1) {
					positionChecked = true;
				};

			}
			
		}

	};

	
    animateOpponents();
    
    gamePiece.namePlayer("eniola", positionColor[playerPositionNo]);
    gamePiece.disableEscapeScreen();
    gamePiece.animate();
    gamePiece.newPos(secondsPassed);
    gamePiece.update();
    playerPosition.text = playerPositionNo;
    playerPosition.update();
    
	// finishLine.speedX = -1;
 //    finishLine.obsPos();
 //    finishLine.update();



    if(gameField.canvas.width < 490 || gameField.canvas.height < 280 ) {
    	gameField.clearZoomInterval();
  	};

  	burnFuel();

  	
  	bar.update();
  	progress.newPro();
  	progress.update();
        
    
	window.requestAnimationFrame(updateField);
    
	
}

const everyinterval = (n) => {
	if ((gameField.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}


//CLICK FUNCTIONS
const hoverUp = () => {
	if(optionA.width == "50px") {
		gameField.clearOption();
	    optionC.choose();
	    optionA.unChoose();
	    showOptions();
    } else if(optionC.width == "50px") {
	    gameField.clearOption();
	    optionB.choose();
        optionC.unChoose();
        showOptions();
    } else {
	    gameField.clearOption();
	    optionA.choose();
        optionB.unChoose();
        showOptions();
    };
}

const hoverDown = () => {
	if(optionA.width == "50px") {
		gameField.clearOption();
	    optionB.choose();
	    optionA.unChoose();
	    showOptions();
    } else if(optionB.width == "50px") {
	    gameField.clearOption();
	    optionC.choose();
        optionB.unChoose();
        showOptions();
    } else {
	    gameField.clearOption();
	    optionA.choose();
        optionC.unChoose();
        showOptions();
    };
}

const select = () => {
   	if(optionA.width == "50px") {
   	if(optionA.text == "Restart") {
   	gameField.reset();
   	};
       gameField.canvas.style.backgroundImage = "url(' '), url(' '), url('Gem Orange.png'), url('Gem Green.png '), url(' ')";
	   gameField.start();
		
    } else if(optionB.width == "50px") {
      	
        
      } else {
      if(optionC.text == "Exit") {
      	window.close();
        } else {
        	gameField.canvas.style.backgroundImage = "url(' '), url(' '), url('Gem Orange.png'), url(' Gem Green.png'), url('')";
        	gameField.reset();
        	gameField.loadIndex();
            gameField.clearOption();
            optionC.unChoose();
            showOptions();
        };
    }
}

const startClick = () => {
	up.onclick = hoverUp;
	down.onclick = hoverDown;
    right.onclick = hoverDown;
    left.onclick = hoverUp;
    center.onclick = select;
}

const endClick = () => {
	up.onclick = " ";
	down.onclick = " ";
    right.onclick = " ";
    left.onclick = " ";
    center.onclick = " ";
}


//CONTROL FUNCTIONS
const moveUp = () =>
	gamePiece.speedY = -50;

const moveDown = () =>
	gamePiece.speedY = 50;

const moveLeft = () => {
	obstacleSpeed = -1;
	opponentSpeed = 250;
};

const clearMoveLeft = () => {
	obstacleSpeed = 2;
	opponents.opponent2.move();
	opponents.opponent3.move();
	opponents.opponent4.move();
	opponents.opponent5.move();
	opponents.opponent6.move();
	opponents.opponent7.move();
}

const moveRight = () => {
    burningFuel = true;
    burnTrigger = true;
    countBy = 2;
    obstacleSpeed = 6;
    opponentSpeed = -100;

    if(fuel < 1) {
    	burningFuel = false;
    	clearMoveRight()
    };

};

const clearMoveRight = () => {
	burningFuel = false;
	burnTrigger = false;
	countBy = 1;
   	obstacleSpeed = 2;
   	opponentSpeed = 50;
};

const clearMove = () => {
	obstacleSpeed = 2;
	opponentSpeed = 50;
    gamePiece.speedX = 0;
    gamePiece.speedY = 0;
};

const pause = () => {         
   // gamePiece.rotateUpdate();
   // //Make canvas full screen
   // game.removeChild(document.getElementById("screen"));
   // game.removeChild(document.getElementById("title"));
   // game.removeChild(document.getElementById("interact"));
   // gameField.canvas.style.minHeight = "100%";
   // gameField.canvas.style.height = "100%";
   // gameField.canvas.style.minWidth = "100%";
   // gameField.canvas.style.width = "100%";
   // gameField.canvas.style.display = "block";
   // game.appendChild(gameField.canvas);
   // //Trying to make the new view full screen
   // gameField.canvas.style.top = "50%";
   // gameField.canvas.style.bottom = "0%";
   // gameField.canvas.style.left = "150%";
   // gameField.canvas.style.right = "0%";
   // gameField.canvas.style.padding = "0%";
   // gameField.canvas.style.margin = "0%";      
};

const resume = () => {
	// gameField.runInterval =
	 //  setInterval(run, 2500);
//     gameField.interval =
	 //  setInterval(updateField, 20);
  //  startControl();
  //  center.onclick = " ";   
};


const startControl = () => {
	up.onmousedown = up.ontouchstart = moveUp;
	down.onmousedown = down.ontouchstart = moveDown;
	left.onmousedown = left.ontouchstart = moveLeft;
	right.onmousedown = right.ontouchstart = moveRight;
}



const endControl = () => {
	up.onmousedown = up.ontouchstart = "";
	down.onmousedown = down.ontouchstart = "";
	left.onmousedown = left.ontouchstart = "";
	right.onmousedown = right.ontouchstart = "";  
};