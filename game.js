let gamePiece, fuel = 300, burningFuel = false, burnTrigger = false;
let numColumns, frameWidth, currentFrame = 0;
let gameObstacle = [], obstacleSave = [], finished = false, obsX, obsY, obsH, obsN= 0, id = 0, obsStartPoint;
let finishLine = [], finishPosition = 0;
let gameScore, pointTotal, highScore, localStore;
let paused;
let fourOptions = true, twoOptions = false;
let choosedDefault = false, optionA, optionB, optionC, optionD, starLeft, starRight;
const up = document.getElementById("up"), down = document.getElementById("down"), 
    left = document.getElementById("left"), right = document.getElementById("right"), 
    center = document.getElementById("center");
let count = 0;
let secondsPassed = 0, oldTimeStamp = 0, fps;
let obstacleSpeed = 2, intervalRate = 250 / obstacleSpeed;
let speedInterval;
let obsPosition;
let opponents = [], opponent = [], opponentSpeed = 0, dodgeSpeed = 0, opponentAvatar = [],
	opp, oppX, oppY, oppW, oppH;
let playerName;
let position = 0, positionDisplay, playerPosition, playerPositionNo,
	allPositions = [90], checkPosition = false, positionChecked = false,
	/** positionColor = [
	'', 'violet', 'teal','green', 'turquoise',
	'olive', 'lime', 'peach', 'maroon', 'pink',
	'silver', 'black', 'white', 'purple', 'magenta',
	'blue', 'yellow', 'orange', 'red'
	]; //ADD 'cyan' IF YOU EVER CHANGE BACKGROUND COLOR */
	positionColor = [' ', 'violet', 'indigo', 'blue', 'green', 'yellow', 'orange', 'red'];
let avatar, pickedCount= 19;
let bar, progress, readingProgress = false;
let gap, gapY1, gapY2, gapY3, gapY4, gapCenter;
let indexAnimate = true, editPlayerAnimate = false, fieldAnimate = false, stopDribble = false;
let loadBar, loadProgress;
let loading = true, oppLoad = false;
let leftArrow, rightArrow, avatarSelected = 0;
let nameInputBox, nameInput, myName, namesArray;
let instruction, finishPositionText, finishPositionWritten = false, th, finishTime = 0;

// localStorage.clear()

 
//PRELOAD GAME ASSETS
preload = function() {
	left1 = new Image();
	left1.src = 'left-arrow.png';
	
	left1.onload = () => {
		left2 = new Image();
		left2.src = 'left-arrow2.png';
			
			left2.onload = () => {
				right2 = new Image();
				right2.src = 'right2.png';
				
				right2.onload = () => {
					right1 = new Image();
					right1.src = 'right.png';
	
					right1.onload = () => {
						img1 =  new Image();
						img1.src = 'sprites/star-bug.png';
	
						img1.onload = () => {
							img2 =  new Image();
							img2.src = 'sprites/purple-bug.png';

							img2.onload = () => {
								img3 =  new Image();
								img3.src = 'sprites/flappy-box.png' ;

									img3.onload = () => {
										avatar = [ img1, img2, img3 ];
										startGame();
									}
							}
						}
					}
				}
			}
	}
	
 };


//SHUFFLE AND ADD OPPONENTS AVATAR AND FEATURES
function loadOpponents() {
	let x = 120;
	const minY = 50;
	const maxY = 220;
	const minN = 0;
	const maxN = 2;
	namesArray = [
		"killer", "baba", "leo", "shittu", "lion",
		"pleasse", "kate", "maine", "mr-money", "og",
		"bintu", "alaye", "boss", "no-1", "them",
		"file-funn", "alayetoshegogo", "glock-9", "pablo", "nathaniel"
	];
	
	for (i = 0; i < 6; i ++) {
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
			sprite: avatar[N],
			name: namesArray[name],
			x: x,
			totalFrames: N === 2 ? 12 : 15,
			currentFrame: 0,
			countBy: 1,
			accelerateStartTime: 200,
			accelerateEndTime: 600,
			accelerateTime: 0,
			accelerateValue: 0,
			checkAccelerate: false,
			checkDetect: false,
			positionPoint: 0,
			position: i,
			escapeGap: y,
			checkGapDifference: false,
			gapDifference: 0,
			stopY: y,
			stopX: x/2 + 10,
			stop: false
		};
		x += 120;
		namesArray.splice(name, 1)
		pickedCount--;
	};
};

//ASSIGN NEW COMPONENTS TO VARIABLES AND CALL LOADINDEX()
startGame = function() {
	// loadBar = new component(465, 10, "white", 110, 135);
	// loadProgress = new component(0, 10, "blue", 110, 135);
	leftArrow = new component(50, 20, left2 , 150, 106, "image");
	rightArrow = new component(50, 20, right1, 470, 106, "image");
	gamePiece = new component(80, 32, img1 , 50, 119, "sprite", 15, 0, 1, 'player');
	gameScore = new component("20px", "Consolas", "black", 210, 100, "text");
	bar = new component(370, 5, "white", 55, 40);
	progress = new component(300, 1, "", 60, 42);
	playerName = new component("17px", "Consolas", 'black' , 0, 0, "center-text");
	// positionDisplay = new component("20px", "Consolas", "white", 210, 40, "text");
    // points = new component("20px", "Consolas", "black", 70, 28, "text");
    playerPosition = new component("20px", "Consolas", "red", 70, 28, "text");
    score = new component("20px", "Consolas", "white", 270, 28, "text");
    paused = new component(105, 70, "play.png", 180, 90, "image");
    optionA = new component("25px", "monospace", "black", '', 120, "center-text");
    optionB = new component("25px", "monospace", "black", '', 155, "center-text");
    optionC = new component("25px", "monospace", "black", '', 190, "center-text");
	optionD = new component("25px", "monospace", "black", '', 225, "center-text");
	starLeft = new component("25px", "monospace", "black", 0, 0, "text");
	starRight = new component("25px", "monospace", "black", 0, 0, "text"); 
	instruction =  new component("25px", "monospace", "white", 0, 150, "center-text");
	finishPositionText =  new component("75px", "monospace", "white", 0, 0, "text");
	th = new component("40px", "monospace", "white", 0, 0, "text");
    gameField.loadIndex();
}


//GAMEFIELD OBJECT
const gameField = {
	canvas :
	document.createElement("canvas"),
	
	loadScreen : function () {
		this.canvas.width = 680;
		this.canvas.height = 270;
		this.context =
		this.canvas.getContext("2d");
		document.getElementById("canvas"). appendChild(this.canvas);
		
		preload();
	},
	
	loadIndex : function() {
		//RETRIEVE INFO FROM LOCAL-STORAGE
		if(typeof(Storage)!=="undefined"){ 
			if(localStorage.name) {
				myName = JSON.parse(localStorage.getItem("name") );  
			} else {
			myName = "-- Me --";
			};
			if(localStorage.sprite) {
				avatarSelected = JSON.parse(localStorage.getItem("sprite") );
				gamePiece.image = avatar[avatarSelected];
				gamePiece.totalFrames = gamePiece.image === img3 ? 12 : 15;
			} else {
				avatarSelected = 0;
				gamePiece.image = avatar[avatarSelected];
			};
		}else {
			alert("localStorage not available, change browser to make game accessible game offline");
		};

		this.frameNo = 0;
		obsStartPoint = this.canvas.width;
		window.requestAnimationFrame(updateIndex);
		startClick();
     },

	start : function() {
		this.reset();
		editPlayerAnimate = false;
		obstacleSpeed = 300;
		playerName.type = "text";
		obsStartPoint = 2480;
		fieldAnimate = true;
		loadOpponents();
		endClick();
		startControl();
        window.requestAnimationFrame(updateField);
	},
	
	finish: function() {
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
      
	reset : function() {
		gamePiece.x = 50; 
		gamePiece.y = 120;
		gameObstacle = [];
		obstacleSave = [];
		obsN= 0;
		id = 0;
	},
	
	totalReset: function() {
		this.reset;
		instruction.y = 150;
		indexAnimate = true;
		editPlayerAnimate = false;
		fieldAnimate = false;
		playerName.width = "17px";
		playerName.color = "black";
		playerName.type = "center-text";
		finishLine = [];
		finishPosition = 0;
		opponents = [];
		opponent = [];
		opponentSpeed = 0;
		dodgeSpeed = 0;
		opponentAvatar = [];
		finishPositionWritten = false;
		finished = false;
		stopDribble = false;
		obstacleSpeed = 2;
		intervalRate = 250 / obstacleSpeed;
		position = 0;
		allPositions = [90];
		checkPosition = false;
		positionChecked = false;
		loading = true;
		oppLoad = false;
		finishTime = 0;
		namesArray = [
			"killer", "baba", "leo", "shittu", "lion",
			"pleasse", "kate", "maine", "mr-money", "og",
			"bintu", "alaye", "boss", "no-1", "them",
			"file-funn", "alayetoshegogo", "glock-9", "pablo", "nathaniel"
		];
		pickedCount= 19;
	},
	
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
	stop : function() {
		clearInterval(this.interval);
	},
	
	stopRun: function() {
		clearInterval(this.runInterval);
	},

	// setZoomSize: function() {
	// 	this.canvas.width+= 1520;
	// 	this.canvas.height+= 1520;
	// 	gamePiece.y+= 1520/2;
	// },

	// checkZoomClear: false,

	// clearZoomInterval: function() {
	// 	if(!this.checkZoomClear) {
	// 		clearInterval(this.zoomInterval);
	// 		gameField.canvas.width = 480;
	// 		gameField.canvas.height = 270;
	// 		gamePiece.y = 119;
	// 		this.checkZoomClear = true;
	// 	};
	// }

}

function component(
	width, 
	height, 
	color, 
	x, 
	y, 
	type, 
	totalFrames, 
	currentFrame,
	countBy,
	name
	) {
	this.name = name;
	this.type = type;
	this.color = color;
	this.totalFrames = totalFrames;
	this.currentFrame = currentFrame;
	this.countBy = countBy;
	if (type === "image" || type === "sprite") {
        this.image = this.color;
    }
	this.width = width;
	this.height = height;
	this.speedX = 0;
	this.speedY = 0;
	this.x = x;
	this.y = y;
	this.update = function() {
		ctx = gameField.context;
		
		if(this.type === "image") {
			ctx.drawImage(
				this.image,
            	 this.x,
        	     this.y,
          	   this.width, 
				this.height
			);
        } else if (this.type === "sprite") {
			frameWidth = this.image.naturalWidth / this.totalFrames;
			let column = this.currentFrame % this.totalFrames;

        	ctx.drawImage(
        		this.image,
        		column * frameWidth,
        		0,
        		frameWidth,
        		this.image.naturalHeight,
        		this.x,
            	this.y,
        		this.width,
        		this.height
	        );
        } else if (this.type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, this.x, this.y);
		  } else if (this.type == "center-text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = this.color;
			let width = ctx.measureText(this.text).width;
			ctx.fillText(this.text,(gameField.canvas.width - width) / 2, this.y);
		  } else {
			ctx.fillStyle = this.color;
			ctx.fillRect(this.x, this.y, this.width, this.height);
	  }
	}
    

    //NEEDS FIXING
    let checked = false;
    this.checkPosition = function(name) {
    	if(checked == false && this.x + this.width >= finishLine.x) {
    	   position += 1;
           checked = true;
        };
    }
    
    this.namePlayer = function(name, color, size) {
    	playerName.text = name;
        let width = ctx.measureText(playerName.text).width;
        playerName.width = `${25 + size}px`;
        playerName.x =
        	(this.x + (this.width/2)) - (width/2) + 5;
        playerName.y = this.y - 3;
        playerName.color = color;
        playerPosition.color = color;
        playerName.update();
        
        if(checked == false && this.x + this.width >= finishLine.x) {
    	   position += 1;
           
           opponentSpeed = 0;
           this.obsPos();
           checked = true;
           //positionDisplay.text = "No " + position + ": " + name;
        };
    }

	this.upScale = () => {
		gamePiece.width*= 2;
		gamePiece.height*= 2;
		gamePiece.x = ((gameField.canvas.width - gamePiece.width) / 2) - 5;
		gamePiece.y = 80;
	}

	this.downScale = () => {
		gamePiece.width/= 2;
		gamePiece.height/= 2;
	}
	
	
	this.animate = function(h) {
		this.currentFrame+= this.countBy;
		if(this.currentFrame >= this.totalFrames) {
			this.currentFrame = 0;
		};
	}

	let finishPositionChecked = false;
	let stopPoint;
	// let t = true;
	this.writeFinishPosition = function(name, player) {
		if (finished && this.x + this.width >= finishLine[0].x) {
			if(!finishPositionChecked) {
				stopPoint = Math.floor(Math.random() * (gameField.canvas.width - 100 - 20 + 1) + 20);
				finishPosition++;
				finishPositionChecked = true;
			}
			if(this.x >= finishLine[0].x + stopPoint) {
				this.name.stop = true;
				this.x = finishLine[0].x + stopPoint;
				if(gamePiece.x  >=  finishLine[0].x + 20) {
					obstacleSpeed = 0;
					clearMoveRight();
					finishLine[0].x = 0;
					finishLine[1].x = 0;
				} 
			};
			if(this.name === "player" && finishPositionWritten === false) {
				th.text = finishPosition === 1 
					? 'st' : finishPosition === 2 
					? 'nd' : finishPosition === 3 
					? 'rd' : 'th';
				//NEED TO WORK ON finishPosition TO SHOW OPPONENTS FINISH POSITION
				//finishPositionText.text = finishPosition;
				finishPositionText.text = playerPositionNo;
				finishPositionWritten = true;
			}
		}
	}

	
	this.explode = function() {
		this.image.src = "explode.png";
		this.width = 190;
		this.height = 100;
	}

	this.dribble = function() {
		//OPPONENTS DODGE OBSTACLES
		for(j = 0; j < obstacleSave.length; j++) {
			// console.log(3, obstacleSave.length, obstacleSave[j].x)
			if (this.x + 345 >= obstacleSave[j].x && this.x < obstacleSave[j].x + 15) {
				let oppY = this.y ;
				let oppYH = this.y + this.height;
				gapCenter = (obstacleSave[j].gap - this.height) / 2 ;

				let gapCenter3 = obstacleSave[j].gapY3 + obstacleSave[j].gap > gameField.canvas.height
					? Math.floor( 
						(gameField.canvas.height - obstacleSave[j].gapY3 - this.height) / 2
					) : (obstacleSave[j].gap - this.height) / 2 ;

				let gapCenter4 = obstacleSave[j].gapY4 + obstacleSave[j].gap > gameField.canvas.height
					? Math.floor( 
						(gameField.canvas.height - obstacleSave[j].gapY4 - this.height) / 2
					) : (obstacleSave[j].gap - this.height) / 2 ;
					
									
				if(
					(oppY > obstacleSave[j].gapY1 && oppYH < obstacleSave[j].y)
					|| (oppY > obstacleSave[j].gapY2 && oppYH < obstacleSave[j].gapY2 + obstacleSave[j].gap)
					|| (oppY > obstacleSave[j].gapY3 && oppYH < obstacleSave[j].gapY3 + obstacleSave[j].gap)
					|| (oppY > obstacleSave[j].gapY4 && oppYH < obstacleSave[j].gapY4 + obstacleSave[j].gap)
				) {
					this.escapeGap = oppY;
				} else {
					let a = obstacleSave[j].gapY1 === undefined ? 1000 :  obstacleSave[j].y < oppYH ? oppYH - obstacleSave[j].y : oppY;
					
					let b = obstacleSave[j].gapY2 + obstacleSave[j].gap < oppYH 
						? oppYH - (obstacleSave[j].gapY2 + obstacleSave[j].gap ):  obstacleSave[j].gapY2 > oppY
						? obstacleSave[j].gapY2 - oppY
						: oppY;
					
					let c = obstacleSave[j].gapY3 === undefined ? 1000 : obstacleSave[j].gapY3 + obstacleSave[j].gap < oppYH 
						? oppYH - (obstacleSave[j].gapY3 + obstacleSave[j].gap ):  obstacleSave[j].gapY3 > oppY
						? obstacleSave[j].gapY3 - oppY
						: oppY;
					
					let d = obstacleSave[j].gapY4 === undefined ? 1000 :  obstacleSave[j].gapY4 > oppY
						? obstacleSave[j].gapY4 - oppY
						: oppY;
					
					let min = a < b && a < c && a < d 
						? a : b < a && b < c && b < d 
						? b : c < a && c < b && c < d 
						? c : d < a && d < b && d < c 
						? d : 0;
					
					this.escapeGap = min === a 
						? obstacleSave[j].gapY1
						: min === b 
						? obstacleSave[j].gapY2
						: min === c 
						? obstacleSave[j].gapY3
						: min === d 
						? obstacleSave[j].gapY4
						: oppY;
				};

				if(oppY > this.escapeGap) {
					  this.y--;
				  } else if(oppY < this.escapeGap) {
					  this.y++;
				  } else {
					  this.y;
				  }
				
			}

		}
	}
	
	this.choose = function() {
		let width = ctx.measureText(this.text).width;
		starLeft.text = starRight.text = '*';
		starLeft.y = starRight.y = this.y + 2.5;
		starLeft.x = ((gameField.canvas.width - width) / 2) - 70;
		starRight.x = gameField.canvas.width - ((gameField.canvas.width - width) / 2) + 70;
		this.width = "35px";
		this.color = "white";
	}
	
	this.unChoose = function() {
		this.width = "25px";
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

    this.move = function(accelerate) {
    	this.speedX = opponentSpeed + accelerate;
    	this.speedY = dodgeSpeed;
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

	
	// this.dribble =
	// function(otherobj) {
	// 	let myLeft = this.x;
	// 	let myRight = this.x + (this.width) -2;
	// 	let myTop = this.y + 5;
	// 	let myBottom = this.y + (this.height);
	// 	let otherLeft = otherobj.x;
	// 	let otherRight = otherobj.x + (otherobj.width);
	// 	let otherTop = otherobj.y;
	// 	let otherBottom = otherobj.y + (otherobj.height);
		
		
	// 	if ((myRight + 200 >= otherLeft) &&
	// 	(myRight < otherLeft + 5)) {
	// 		myBottom < otherTop || myTop > otherBottom
	// 		?  myTop = myTop
	// 		:   myBottom > otherTop
	// 		?	myTop--
	// 		:	myTop < otherBottom
	// 		?	myTop++
	// 		:	myTop;
			
	// 	}
	// }

	// 	/**if ((myBottom < otherTop) ||
	// 	 (myTop > otherBottom) ||
	// 	 (myRight + 200 < otherLeft) {
	// 		myTop = myTop;
	// 	} else */
		
		
}





function showOptions() {
	if(fourOptions) {
		optionA.text = "Play Game";
		optionB.text = "View Portfolio";
		optionC.text = "Credits";
		optionD.text = "Buy My Cat A Treat";
		optionA.update();
		optionB.update();
		optionC.update();
		optionD.update();
	} else if (twoOptions) {
		optionC.text = "Change Name";
		optionD.text = "Exit";

		if(!choosedDefault) {
			optionC.choose();
			choosedDefault = true;
		}

		optionC.update();
		optionD.update();
	}
	starLeft.update();
	starRight.update();
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
	    optionA.text = "Restart";
	    optionC.text = "Home";
	    showOptions();
	    setTimeout(startClick, 150); 
	}, 440);
}


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
			gamePiece.countBy = 1;
		   	obstacleSpeed = 2;
		   	opponentSpeed = 0;
		}
	};
	
}

const createObstacles = () => {
		//CREATE OBSTACLES
		let x, height, minHeight, maxHeight, minY, maxY, minGap, maxGap, minDelay, maxDelay;
		if (gameField.frameNo  === 1 ) {
			x = obsStartPoint;
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
	
			gapY1 = y > 34 ? 0 : undefined;
			gapY2 = y + height;
			gapY3 = y + height + gap + height < gameField.canvas.height - 34 
				? y + height + gap + height
				: undefined;
			gapY4 = 
				y + height + gap + height + gap + height  < gameField.canvas.height - 34 
				? y + height + gap + height + gap + height 
				: undefined;
	
			obstacleSave.push({
				y: y,
				x: x,
				gap: gap,
				gapY1: gapY1,
				gapY2: gapY2,
				gapY3: gapY3,
				gapY4: gapY4
			});
	
			id++;
			obsN++;
		}
}

const moveObstacles = () => {
	//MOVE OBSTACLES
	for (i = 0; i < gameObstacle.length; i++) {
		gameObstacle[i].speedX = -1;
		gameObstacle[i].obsPos();
		gameObstacle[i].update();
		obsPosition = gameObstacle[i].x;
		
		if (fieldAnimate && gamePiece.crashWith(gameObstacle[i])) {
			if(!burningFuel) {
				obstacleSpeed = 0;
				opponentSpeed = 100;  
			} else {
				obstacleSpeed = -2;
				opponentSpeed = 200;  
				setTimeout(() => {
					clearMoveRight();
				}, 300);
			}
			
		} 
			
		
		/** fieldAnimate ? gamePiece.crashWith(gameObstacle[i]) : null; */
		
		/** for(j = 0; j < opponents.length; j++) {
			if(opponent[j].crashWith(gameObstacle[i])) {
				let newX = opponent[j].x - 20;
				let newY = opponent[j].y -= 5;
				opponent[j].x = newX;
				opponent[j].y = newY;
				
			}
		}  */
	};
}

const updateIndex = () => {
	if(!indexAnimate) {
		return editPlayerAnimate = true;
	}
	gameField.clear();
	gameField.frameNo += 1;
	gamePiece.countBy = 2;
	obstacleSpeed = 6;
	createObstacles();
	moveObstacles();

	//OBSTACLES
	if( obsPosition  <= obsStartPoint - 280) {
		gameField.frameNo  = 0;
		obsPosition = obsStartPoint;
	};

	for(j = 0; j < obstacleSave.length; j++) {
		obstacleSave[j].x+= (-1 * obstacleSpeed);
	};
	!stopDribble ? gamePiece.dribble() : null;
    gamePiece.disableEscapeScreen();
    gamePiece.animate();
    gamePiece.newPos(secondsPassed);
    gamePiece.update();

	showOptions();
	if(!choosedDefault) {
		optionA.choose();
		choosedDefault = true;
	}
	
	window.requestAnimationFrame(updateIndex);
}

const pickAvatar = () => {
	gamePiece.image = avatar[avatarSelected];
	
	leftArrow.update();
	rightArrow.update();
	right.onclick = () => avatarSelected < 2 ? avatarSelected++ : avatarSelected = 0;
	left.onclick = () => avatarSelected > 0 ?  avatarSelected-- : avatarSelected = 2;
	leftArrow.image = avatarSelected > 0 ? left1 : left2;
	rightArrow.image = avatarSelected < 2 ? right1 : right2;

	//console.log(avatarSelected)
}

const inputName = () => {
	nameInputBox = new component(gameField.canvas.width - 340, 20, "black", 170, gamePiece.y + gamePiece.height + 20);
	nameInput = new component(nameInputBox.width - 4, nameInputBox.height - 2, "#33FCF3", nameInputBox.x + 2, nameInputBox.y + 1);
	nameInputBox.update(); 
	nameInput.update();
	playerName.text = myName;
	playerName.y = nameInput.y + nameInput.height - 3;
	playerName.update();
	
	up.onclick = down.onclick = () => {
		const name = myName;
		myName = prompt("Enter Name", myName).toLowerCase();
		myName = myName === null ||  /[a-zA-Z]/.test(myName) !== true ? name : myName;
		if(myName.length > 14) {
			myName = myName.slice(0, 14);
		};
		myName = myName.replace(/ /g, "-");
		localStorage.setItem("name", JSON.stringify(myName) );
	}
}

const editPlayer = () => {
	if(!editPlayerAnimate) {
		return
	}
	gameField.clear();
	pickAvatar();
	inputName();
	instruction.text = "Click Center Button To Start Game";
	instruction.y = nameInputBox.y + nameInputBox.height + 50;
	instruction.update();
	gamePiece.totalFrames = gamePiece.image === img3 ? 12 : 15;
	gamePiece.animate();
	gamePiece.update();
	
	window.requestAnimationFrame(editPlayer);
}

const miniOptions = () => {
	optionA.unChoose();
	choosedDefault = false;
	fourOptions = false;
	twoOptions = true;
}

// const startingField = () => {
// 	loadBar.update();
// 	loadProgress.width = obstacleSave[0].x >= gameField.canvas.width && loadProgress.width <= loadBar.width
// 	? loadProgress.width += 2.85 : loadBar.width + 1;
// 	loadProgress.update();
// 	showOptions();
// 	miniOptions();
// }

const loadOpp = () => {
	loadOpponents();
	gamePiece.countBy = 1;
	oppLoad = true;
}

const startField = () => {
	loading = false;
	obstacleSpeed = 2;
	endClick();
	startControl();
	center.ondblclick = pause;
}

const restartGame = () => {
	center.ondblclick = "";
	console.log("xx", center.ondblclick)
	gameField.totalReset();
	gameField.loadIndex();
}

const finishField = () => {
	finishTime++;
	const width = ctx.measureText(finishPositionText.text).width;
	finishPositionText.x = ((gameField.canvas.width - width) / 2) - 50;
	finishPositionText.y = 150;
	th.x = finishPositionText.x + 60;
	th.y = finishPositionText.y - 5;
	th.update();
	finishPositionText.update();
	endControl();
	instruction.text = "Press Center Button To Continue";
	//ENABLE CENTER BUTTON FOR RESTART
	if(finishTime >= 59) {
		instruction.update();
		startClick();
	};
}


//UPDATE GAMEFIELD
const updateField = (timeStamp) => {
	if(!fieldAnimate) {
		return
	}

	secondsPassed = (timeStamp - oldTimeStamp) / 1000  ;
	secondsPassed = Math.min(secondsPassed, 0.1);
    oldTimeStamp = timeStamp;
    
    fps = Math.round(1 / secondsPassed);
	
	gameField.clear();
	gameField.frameNo += 1;

	createObstacles();
	moveObstacles();

	//OBSTACLES
	//59
	if(obsN <= 15) {
		if( obsPosition  <= obsStartPoint - 280) {
			gameField.frameNo  = 0;
			obsPosition = obsStartPoint;
		}
	} else {
		if(!finished) {
			let x = obsStartPoint + 280;
			finishLine.push(new component(10, 25, "green", x, 0));
			finishLine.push(new component(10, 25, "green", x, gameField.canvas.height - 25));
			finished = true;
		}
		for (i = 0; i < finishLine.length; i++) {
			finishLine[i].speedX = -1;
			finishLine[i].obsPos();
			finishLine[i].update();
		}
	}


	for(j = 0; j < obstacleSave.length; j++) {
		obstacleSave[j].x+= (-1 * obstacleSpeed);
		if(obstacleSave[0].x <= gameField.canvas.width + (obsStartPoint / 4) && !oppLoad) {
			loadOpp();
		} else if(obstacleSave[0].x <= gameField.canvas.width + 10 && loading) {
			startField();
			readingProgress = true;
		};
	};

	//OPPONENTS UPDATE TO SCREEN
	for (i = 0; i < opponents.length; i++) {
		if(opponent[i] === undefined) {
			opponent[i] = new component(
				80, 
				32, 
				opponents[i].sprite , 
				opponents[i].x , 
				opponents[i].y, 
				"sprite", 
				opponents[i].totalFrames,
				opponents[i].currentFrame,
				opponents[i].countBy,
				opponents[i]
			);
		} else {
		/** if (gamePiece.crashWith(opponent[i])) {
			if(burningFuel) {
				obstacleSpeed = 1;
				opponent[i].x+= 5;
				opponentSpeed = 100; 
				setTimeout(() => {
					obstacleSpeed = 2;
					opponentSpeed = 0; 
				}, 200);
			} 
		} */
			//gamePiece.crashWith(opponent[i]);

			//RANDOM ACCELERATIONS
			opponents[i].accelerateTime++;

			opp = opponent[i];
			oppX = opponent[i].x;
			oppY = opponent[i].y;
			oppH = opponent[i].height;
			oppW = opponent[i].width;

			let minAV = 45;
			let maxAV = 85;
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
					opponent[i].countBy = 2;
					opponents[i].checkAccelerate = true;
			} else if(
				opponents[i].checkAccelerate && 
				opponents[i].accelerateTime >= opponents[i].accelerateEndTime
			) {
				opponents[i].accelerateValue = 
					Math.floor(Math.random() * (maxDV - minDV + 1) + minDV);
				opponent[i].countBy = 1;
				opponents[i].accelerateTime = 0;
				opponents[i].checkAccelerate = false;
			}

			opponent[i].dribble();
			opponent[i].namePlayer(
				opponents[i].name, 
				positionColor[opp.position],
				-opp.position
			);
			opponent[i].disableEscapeScreen();
			opponent[i].animate();
			!opponents[i].stop ? opponent[i].move(opponents[i].accelerateValue) : null ;
			!opponents[i].stop ? opponent[i].newPos(secondsPassed) : null;
			opponent[i].writeFinishPosition(opponents[i].name);
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

    gamePiece.namePlayer(
		myName, 
		positionColor[playerPositionNo], 
		-playerPositionNo
);
    gamePiece.disableEscapeScreen();
    gamePiece.animate();
    gamePiece.newPos(secondsPassed);
	gamePiece.writeFinishPosition(myName, true);
    gamePiece.update();
    const posSt = playerPositionNo === 1 ? "st" : playerPositionNo === 2 ? "nd" : playerPositionNo === 3 ? "rd" : "th";
    playerPosition.text = playerPositionNo != undefined
		? `${playerPositionNo}${posSt}`
		: ' ';
    
  burnFuel();

  if(finishPositionWritten) {
		finishField();
	} else {
			playerPosition.update();
			if(readingProgress) {
  				bar.update();
  				progress.newPro();
  				progress.update();
 			};
	};

	
	window.requestAnimationFrame(updateField);
}


const openPortfolio = () => {
	endClick();
	indexAnimate = false;
	gameField.clear();
	instruction.text = "Portfolio Opened In A New Tab";
	instruction.update();
	setTimeout(() => {
		startClick();
		gameField.clear();
		indexAnimate = true;
		optionA.choose();
		optionB.unChoose();
		window.requestAnimationFrame(updateIndex);
	}, 1000);
}

const everyinterval = (n) => {
	if ((gameField.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}


//CLICK FUNCTIONS
const hoverUp = () => {
	if(fourOptions) {
		if(optionA.width >= "30px") {
			gameField.clear();
			optionD.choose();
			optionA.unChoose();
			showOptions();
		} else if(optionD.width >= "30px") {
			gameField.clear();
			optionC.choose();
			optionD.unChoose();
			showOptions();
		}else if(optionC.width >= "30px") {
			gameField.clear();
			optionB.choose();
			optionC.unChoose();
			showOptions();
		} else {
			gameField.clear();
			optionA.choose();
			optionB.unChoose();
			showOptions();
		};
	} else if (twoOptions) {
		if(optionC.width >= "30px") {
			gameField.clear();
			optionD.choose();
			optionC.unChoose();
			showOptions();
		} else {
			gameField.clear();
			optionC.choose();
			optionD.unChoose();
			showOptions();
		}
	}
	
}

const hoverDown = () => {
	if(fourOptions) {
		if(optionA.width >= "30px") {
			gameField.clear();
			optionB.choose();
			optionA.unChoose();
			showOptions();
		} else if(optionB.width >= "30px") {
			gameField.clear();
			optionC.choose();
			optionB.unChoose();
			showOptions();
		} else if(optionC.width >= "30px") {
			gameField.clear();
			optionD.choose();
			optionC.unChoose();
			showOptions();
		} else {
			gameField.clear();
			optionA.choose();
			optionD.unChoose();
			showOptions();
		};
	} else if (twoOptions) {
		if(optionC.width >= "30px") {
			gameField.clear();
			optionD.choose();
			optionC.unChoose();
			showOptions();
		} else {
			gameField.clear();
			optionC.choose();
			optionD.unChoose();
			showOptions();
		} 
	}
}

const select = () => {
   	if(optionA.width == "35px") {
		// optionA.text === "Restart" ? gameField.reset() : null;
		
		// 
		//miniOptions();
		if(indexAnimate) {
			gamePiece.upScale();
			window.requestAnimationFrame(editPlayer);
			indexAnimate = false;
		} else if(editPlayerAnimate) {
			gameField.start();
			gamePiece.downScale();
			localStorage.setItem("sprite", JSON.stringify(avatarSelected) );
		} else if ( fieldAnimate) {
			restartGame();
		};
		
    } else if(optionB.width == "35px") {
   // 	window.open('https://eniolafashola.github.io', '_blank');;
    	openPortfolio();
	} else if (optionC.width == "35px") {
      	
        
	} else if(optionD.width == "35px") {
		if(optionD.text == 'Exit') {
			twoOptions = false;
			choosedDefault = false;
			fourOptions = true;
			optionD.unChoose();
		}
	}
}

const startClick = () => {
	up.onclick = left.onclick = hoverUp;
	down.onclick = right.onclick = hoverDown; 
    center.onclick = select;
}

const endClick = () => {
	up.onclick = down.onclick =  right.onclick = left.onclick = center.onclick = " ";
}


//CONTROL FUNCTIONS
const moveUp = () => {
	gamePiece.speedY = -50;
	obstacleSpeed = 3;
}

const moveDown = () => {
	gamePiece.speedY = 50;
	obstacleSpeed = 3;
}

const moveLeft = () => {
	obstacleSpeed = -1;
	opponentSpeed = 200;
};

/** const clearMoveLeft = () => {
	obstacleSpeed = 2;
	opponents.opponent2.move();
	opponents.opponent3.move();
	opponents.opponent4.move();
	opponents.opponent5.move();
	opponents.opponent6.move();
	opponents.opponent7.move();
}*/

const moveRight = () => {
    burningFuel = true;
    burnTrigger = true;
    gamePiece.countBy = 2;
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
	gamePiece.countBy = 1;
   	obstacleSpeed = 2;
   	opponentSpeed = 0;
};

const clearMove = () => {
	obstacleSpeed = 2;
	opponentSpeed = 0;
    gamePiece.speedX = 0;
    gamePiece.speedY = 0;
};

const pause = () => {         
   fieldAnimate = false;
   console.log("pause")
};

const resume = () => {
	if(fieldAnimate === true) {
		console.log("pause2");
		return
	};
	console.log("play")
	fieldAnimate = true;
	window.requestAnimationFrame(updateField);
};


const startControl = () => {
	up.onmousedown = up.ontouchstart = moveUp;
	down.onmousedown = down.ontouchstart = moveDown;
	left.onmousedown = left.ontouchstart = moveLeft;
	right.onmousedown = right.ontouchstart = moveRight;
	up.onmouseup = up.ontouchend = down.onmouseup = down.ontouchend = left.onmouseup = left.ontouchend = clearMove;
	right.onmouseup = right.ontouchend = clearMoveRight;
	
	//RESUME AFTER PAUSE
	center.onclick = resume;
}

const endControl = () => {
	up.onmousedown = up.ontouchstart = down.onmousedown = down.ontouchstart = left.onmousedown = left.ontouchstart = right.onmousedown = right.ontouchstart = up.onmouseup = up.ontouchend = down.onmouseup = down.ontouchend = left.onmouseup = left.ontouchend = center.onmouseup = center.ontouchend = right.onmouseup = right.ontouchend = " " ;  
};