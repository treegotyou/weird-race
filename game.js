let gamePiece, gamePieceClone, fuel = 300, burningFuel = false, burnTrigger = false;
const nameStore = [
		"killer", "baba", "leo", "shittu", "lion",
		"pleasse", "kate", "maine", "mr-money", "og",
		"bintu", "alaye", "boss", "no-1", "them",
		"file-funn", "alayetoshegogo", "glock-9", "pablo", "nathaniel", "i-am-the-man", 
		"ton-to-boyy", "dammy-krane", "Elizabeth", "white-oosha", "saheed", "ayer", "ayee", 
		"Sam", "2pack", "layer", "bro-mustapha"
];
let numColumns, frameWidth, currentFrame = 0;
let gameObstacle = [], obstacleSave = [], finished = false, obsX, obsY, obsH, obsN= 0, id = 0, obsStartPoint;
let finishLine = [], finishPosition = 0;
let paused;
let optionA, optionB, optionC, optionD;
let secondsPassed = 0, oldTimeStamp = 0, fps;
let obsSpeedValue = 5, obstacleSpeed = 6, intervalRate = 250 / obstacleSpeed;
let speedInterval;
let obsPosition;
let opponents = [], opponent = [], opponentSpeed = -50, dodgeSpeed = 0, opponentAvatar = [],
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
let avatar, pickedCount;
let bar, progress, readingProgress = false;
let gap, gapY1, gapY2, gapY3, gapY4, gapCenter;
let indexAnimate = true, editingPlayer = false, fieldAnimate = false, fieldPaused = false, stopDribble = false;
let loading = true, oppLoad = false;
let leftArrow, rightArrow, avatarSelected = 0;
let myName, namesArray;
let finishPositionText, finishPositionWritten = false, th, finishTime = 0;
let background, power;
let difficulty, minAV, maxAV, minDV,  maxDV;
let countDown, countDisplay;
let optionsBox, editBox, controlBox;
let backgroundGrass;
let timesPlayed, checkTimesPlayed;



// localStorage.clear()


//LOAD FONTS
const loadFonts = () =>{
	WebFontConfig = {
		google: {
			families: [
				'Permanent Marker:300, 400, 700', 
				'Rubik Vinyl: 300, 400, 700', 
				'Frijole: 300, 400, 700'
			]
		},
		loading: function() {
			
		},
		active: function() {
			
		}
	};

	(function(d) {
		var wf = d.createElement('script'), s = d.scripts[0];
		wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
		wf.async = true;
		s.parentNode.insertBefore(wf, s);
	})(document);
};



//PRELOAD GAME ASSETS
preload = function() {
	loadFonts();
	grass = new Image();
	grass.src = 'background/grass.png';

	grass.onload = () => {
		left1 = new Image();
		left1.src = 'interact/left-arrow.png';
		
		left1.onload = () => {
			left2 = new Image();
			left2.src = 'interact/left-arrow2.png';
				
				left2.onload = () => {
					right2 = new Image();
					right2.src = 'interact/right2.png';
					
					right2.onload = () => {
						right1 = new Image();
						right1.src = 'interact/right.png';
		
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

											// light = new Image();
											// light.src = 'lightning.png';
										}
								}
							}
						}
					}
				}
		}
	}
};


//SHUFFLE AND ADD OPPONENTS AVATAR AND FEATURES
const loadOpponents = () => {
	let x = 200;
	const minY = 50;
	const maxY = 370;
	const minN = 0;
	const maxN = 2;
	namesArray = [].concat(nameStore);
	pickedCount = namesArray.length - 1;
	
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
			countBy: 2,
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
		x += 200;
		namesArray.splice(name, 1)
		pickedCount--;
	};
};

//ASSIGN NEW COMPONENTS TO VARIABLES AND CALL LOADINDEX()
startGame = function() {
	backgroundGrass = new component(1300, 280, grass , 0, 150, "background");
	gamePiece = new component(80, 32, img1 , 50, 194, "sprite", 15, 0, 1, 'player');
	gamePieceClone = new component(160, 64, img1 , ((gameField.canvas.width - 160) / 2) - 10, 225, "sprite", 15, 0, 1, 'player'); 
	//x=((gameField.canvas.width - (gamePiece.width * 2)) / 2) - 10
	leftArrow = new component(50, 20, left2 , ((gameField.canvas.width - 160) / 2) - 110, 250, "image");
	rightArrow = new component(50, 20, right1, ((gameField.canvas.width - 160) / 2) + 210, 250, "image");
	// bar = new component(370, 5, "white", 80, 38);
	// progress = new component(300, 1, "", bar.x + 5, bar.y + 2);
	// power = new component(50, 30, '' , 20, bar.y - 10, "image");
	playerName = new component("17px", "Permanent Marker", 'black' , 0, 0, "center-text");
    playerPosition = new component("50px", "Frijole", "violet", 530, 58, "text");
	finishPositionText =  new component("75px", "Frijole", "black", 0, 0, "text");
	th = new component("40px", "Frijole", "white", 0, 0, "text");
	background = new component(0, 0, "black", 0, 0);
	// countDisplay = new component("75px", "Frijole", "black", 0, 0, "text");
    gameField.loadIndex();
}

const showIndexOptions = () => {
	
	optionsBox = document.createElement("span");
	document.getElementById("game").appendChild(optionsBox);
	optionsBox.setAttribute("id", "options-box");
	optionsBox.style.fontFamily = "Rubik Vinyl";
	
	optionA = document.createElement("h1");
	optionB = document.createElement("h1");
	optionC = document.createElement("h1");
	optionD = document.createElement("h1");
	
	optionA.appendChild(document.createTextNode("Play Game"));
		optionB.appendChild(document.createTextNode("View Portfolio"));
		optionC.appendChild(document.createTextNode("Credits"));
		optionD.appendChild(document.createTextNode("Support Me")); 
		
		optionsBox.appendChild(optionA);
		optionsBox.appendChild(optionB);
		optionsBox.appendChild(optionC);
		optionsBox.appendChild(optionD);
		
		optionA.onclick = () => {
			removeIndexOptions();
			gameField.editPlayer();
			editingPlayer = true;
		}
		
		optionB.onclick = () => {
			window.open('https://eniolafashola.github.io', '_blank');
		}
}

const removeIndexOptions = () => {
	document.getElementById("game").removeChild(optionsBox);
}

const addControl = () => {
	controlBox = document.createElement("span");
	document.getElementById("game").appendChild(controlBox);
	controlBox.setAttribute("id", "control-box");
	
	const up = document.createElement("span");
	up.setAttribute("id", "upward");
	const down = document.createElement("span");
	down.setAttribute("id", "downward");
	
	controlBox.appendChild(up);
	controlBox.appendChild(down);
	
	up.onmousedown = up.ontouchstart = moveUp;
	down.onmousedown = down.ontouchstart = moveDown;

	up.onmouseup = up.ontouchend = down.onmouseup = 
	down.ontouchend =  clearMove;
	
}


//GAMEFIELD OBJECT
const gameField = {
	
	
	canvas :
	document.createElement("canvas"),

	loadScreen : function () {
		this.canvas.width = screen.width < 600 ?  680 : 1200 ;
		this.canvas.height = 420;
		this.context =
		this.canvas.getContext("2d");
		
		document.getElementById("canvas").appendChild(this.canvas);
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
			} else {
				avatarSelected = 0;
			};
		}else {
			alert("localStorage not available, change browser to make game accessible game offline");
		};

		gamePiece.image = avatar[avatarSelected];
		gamePiece.totalFrames = gamePiece.image === img3 ? 12 : 15;
		this.frameNo = 0;
		obsStartPoint = this.canvas.width;
		showIndexOptions();
		window.requestAnimationFrame(updateIndex);
    },
     
     
    editPlayer: function() {
     	editBox = document.createElement("span");
     	editBox.setAttribute("id", "edit-box");
     
     	const arrowBox = document.createElement("span");
		 arrowBox.setAttribute("id", "arrow-box");
		
		const input = document.createElement("Input");
		input.setAttribute("id", "name-input");
		
		const buttonBox = document.createElement("span");
		buttonBox.setAttribute("id", "select-player-button-box");
		
		const buttonA = document.createElement("button");
		buttonA.innerText = "Start";
		buttonA.setAttribute("id", "select-player-button-a");
		
		
		const buttonB = document.createElement("button");
		buttonB.setAttribute("id", "select-player-button-b");
		buttonB.innerText = "Exit";
		
		buttonBox.appendChild(buttonA);
		buttonBox.appendChild(buttonB);
	
		document.getElementById("game").appendChild(editBox);
		
		editBox.appendChild(arrowBox);
		editBox.appendChild(input). placeholder = "Edit Name"; 
		editBox.appendChild(buttonBox);
	
		left = document.createElement("span");
		right = document.createElement("span");
		left.setAttribute("id", "left");
		right.setAttribute("id", "right");
		arrowBox.appendChild(left);
		arrowBox.appendChild(right);
		
		buttonA.onclick = () => {
			this.start();
			document.getElementById("game").removeChild(editBox);
			localStorage.setItem("sprite", JSON.stringify(avatarSelected) );
		}
		
		buttonB.onclick = () => {
			document.getElementById("game").removeChild(editBox);
			showIndexOptions();
			editingPlayer = false;
		}
	
		pickAvatar();
    
	},
     

	start : function() {
		if(typeof(Storage)!=="undefined"){ 
			if(localStorage.min) {
				minDV = JSON.parse(localStorage.getItem("min") );
				maxDV = minDV + 15;
			} else {
				minDV = 0;
				maxDV = 15;
			};
			
			if(localStorage.playtimes) {
				timesPlayed = JSON.parse(localStorage.getItem("playtimes") );
			} else {
				timesPlayed = 0;
			};
		};

		checkTimesPlayed = false;
		minAV = maxDV + 10;
		maxAV = minAV + 15;
		this.reset();
		indexAnimate = false;
		editingPlayer = false;
		obstacleSpeed = 60;
		playerName.type = "text";
		obsStartPoint = 2480;
		fieldAnimate = true;
		loadOpponents();
		addControl();
        window.requestAnimationFrame(updateField);
	},
	
	
	finish: function() {
		const finishedBox = document.createElement("span");
		document.getElementById("game").appendChild(finishedBox);
		finishedBox.setAttribute("id", "finished-box");
	
		const button = document.createElement("button");
		button.innerText = "Continue";
		button.setAttribute("id", "finished-button");
		finishedBox.appendChild(button);
		
		button.onclick = () => {
			document.getElementById("game").removeChild(finishedBox);
			this.totalReset();
			this.loadIndex();
		}
		
		timesPlayed++;
		localStorage.setItem("playtimes", JSON.stringify(timesPlayed) );
	},
	
      
	reset : function() {
		gamePiece.x = 50; 
		gamePiece.y = 194;
		gameObstacle = [];
		obstacleSave = [];
		obsN= 0;
		id = 0;
	},
	
	
	totalReset: function() {
		this.reset;
		indexAnimate = true;
		editingPlayer = false;
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
		obstacleSpeed = 5;
		intervalRate = 250 / obstacleSpeed;
		position = 0;
		allPositions = [90];
		checkPosition = false;
		positionChecked = false;
		loading = true;
		oppLoad = false;
		finishTime = 0;
		namesArray = [].concat(nameStore);
		pickedCount= namesArray.length - 1;
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
	if (
	type === "image" 
	|| type === "sprite"
	|| type === "background"
	) {
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
		
		if(this.type === "image" || this.type === "background") {
			ctx.drawImage(
				this.image,
				this.x,
				this.y,
				this.width, 
				this.height
			);
			if (this.type == "background") {
        ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        	}
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

    this.namePlayer = function(name, color, size ) {
    	playerName.text = name;
        let width = ctx.measureText(playerName.text).width;
        playerName.width = `${25 + size}px`;
        playerName.x = (this.x + (this.width/2)) - (width/2) + 5;
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

	this.animate = function(h) {
		this.currentFrame+= this.countBy;
		if(this.currentFrame >= this.totalFrames) {
			this.currentFrame = 0;
		};
	}

	let finishPositionChecked = false;
	let stopPoint;
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
					clearMove();
					finishLine[0].x = 0;
					finishLine[1].x = 0;
				} 
			};
			if(this.name === "player" && finishPositionWritten === false) {
				th.text = playerPositionNo === 1 
					? 'st' : playerPositionNo === 2 
					? 'nd' : playerPositionNo === 3 
					? 'rd' : 'th';
				//NEED TO WORK ON finishPosition TO SHOW OPPONENTS FINISH POSITION
				//finishPositionText.text = finishPosition;
				finishPositionText.color = positionColor[playerPositionNo];
				finishPositionText.text = playerPositionNo;
				
				difficulty = playerPositionNo === 1
					? 3 :  playerPositionNo === 2
					? 2 : playerPositionNo === 3
					? 1 : playerPositionNo === 4
					? -1 : playerPositionNo === 5
					? -2 : playerPositionNo === 6
					? -3 : -4;
				
				const minDv = minDV + difficulty >= 0 
					? minDV + difficulty : 0;
					localStorage.setItem("min", JSON.stringify(minDv) );
				finishPositionWritten = true;
			}
		}
	}

	this.dribble = function() {
		//OPPONENTS DODGE OBSTACLES
		for(j = 0; j < obstacleSave.length; j++) {
			if (this.x + 385 >= obstacleSave[j].x && this.x < obstacleSave[j].x + 15) {
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
	
	this.disableEscapeScreen = function() {
		if(this.y > gameField.canvas.height - (this.height * 2)) {
			this.y = gameField.canvas.height - (this.height *2);
		} else if(this.y < 0) {
			this.y = 0;
       };
	}

    this.move = function(accelerate) {
    	this.speedX = opponentSpeed + accelerate;
    }
	
	this.newPos = function(secondsPassed) {
		this.x += (this.speedX * secondsPassed );
		this.y += (this.speedY * secondsPassed);
		
	}

	// this.newPro = function(secondsPassed) {
	// 	this.width = fuel * 1.2;
	// 	if(this.width > 350) {
	// 		this.color = "green";
	// 	} else if(this.width < 350 && this.width > 180) {
	// 		this.color = "#0fb71d";
	// 	} else if(this.width < 180 && this.width > 80) {
	// 		this.color = "#54d254";
	// 	} else if (this.width < 80 && this.width > 70) {
	// 		this.color = "#9baf17";
	// 	} else if(this.width < 70 && this.width > 35) {
	// 		this.color = "red";
	// 	} else{
	// 		this.color = "#b90a0a";
	// 	};
	// }
	
	this.obsPos = function() {
		this.x += (this.speedX * obstacleSpeed);
		this.y += (this.speedY * obstacleSpeed);
		if (this.type === "background") {
        	if (this.x <= -this.width) {
       	 	this.x = 0;
       		}
    	}
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

// const burnFuel = () => {
// 	if(!burningFuel && fuel <  300) {
// 		fuel+= 5;
// 		if(fuel + 5 >= 300) {
// 			fuel = 300;
// 			if (burnTrigger) {
// 				moveRight();
// 			}
// 		}
// 	} else if(burningFuel && fuel > 0 ){
// 		fuel--;
// 		if(fuel === 0) {
// 			burningFuel = false;
// 			gamePiece.countBy = 1;
// 		   	obstacleSpeed = 2;
// 		   	opponentSpeed = obstacleSpeed * (-10);
// 		}
// 	};
	
// }


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
			maxHeight = 95;
			height =
			Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
			minY = 0;
			maxY = 50;
			y =
			Math.floor(Math.random() * (maxY - minY + 1) + minY);
			minGap = 40;
			maxGap = 151;
			gap =
			Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
			
			
			gameObstacle.push(new component(10, height, "yellow", x + delay, y));
			gameObstacle.push(new component(10, height, "yellow", x + delay, y + height + gap));
			gameObstacle.push(new component(10, height , "yellow", x + delay, y + height + gap + height + gap));
			gameObstacle.push(new component(10, height , "yellow", x + delay, y + height + gap + height + gap + height + gap ));
	
	
			gapY1 = y > 34 ? 0 : undefined;
			gapY2 = y + height;
			gapY3 = y + height + gap + height < gameField.canvas.height - 64
				? y + height + gap + height
				: undefined;
			gapY4 = 
				y + height + gap + height + gap + height  < gameField.canvas.height - 64
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
		
		//CHECK PLAYER CRASH
		if (fieldAnimate && gamePiece.crashWith(gameObstacle[i])) {
				obstacleSpeed = 0;
				opponentSpeed = 120;
		} 
	};
}

const updateIndex = () => {
	if(!indexAnimate) {
		return 
	}
	gameField.clear();
	gameField.frameNo += 1;
	gamePiece.countBy = 2;
	createObstacles();
	moveObstacles();

	//OBSTACLES
	if( obsPosition  <= obsStartPoint - 320) {
		gameField.frameNo  = 0;
		obsPosition = obsStartPoint;
	};

	for(j = 0; j < obstacleSave.length; j++) {
		obstacleSave[j].x+= (-1 * obstacleSpeed);
	};
	gamePiece.dribble();
    gamePiece.disableEscapeScreen();
    gamePiece.animate();
    gamePiece.newPos(secondsPassed);
    gamePiece.update();
    
    backgroundGrass.speedX = -1;
    backgroundGrass.obsPos(secondsPassed);
    backgroundGrass.update();
    
    editingPlayer ? pickAvatar() : null;

	window.requestAnimationFrame(updateIndex);
}

const pickAvatar = () => {
	gamePieceClone.image = avatar[avatarSelected];
	gamePiece.image = gamePieceClone.image;
	gamePiece.totalFrames = gamePiece.image === img3 ? 12 : 15;
	gamePieceClone.totalFrames = gamePiece.image === img3 ? 12 : 15;

	leftArrow.update();
	rightArrow.update();
	gamePieceClone.animate();
	gamePieceClone.update();
	right.onclick = () => avatarSelected < 2 ? avatarSelected++ : avatarSelected = 0;
	left.onclick = () => avatarSelected > 0 ?  avatarSelected-- : avatarSelected = 2;
	
	leftArrow.image = avatarSelected > 0 ? left1 : left2;
	rightArrow.image = avatarSelected < 2 ? right1 : right2;
}

// const inputName = () => {
	
	
	
	
// 	up.onclick = down.onclick = () => {
// 		const name = myName;
// 		myName = prompt("Enter Name", myName);
// 		myName = myName === null ||  /[a-zA-Z]/.test(myName) !== true ? name : myName.toLowerCase();
// 		if(myName.length > 14) {
// 			myName = myName.slice(0, 14);
// 		};
// 		myName = myName.replace(/ /g, "-");
// 		localStorage.setItem("name", JSON.stringify(myName) );
// 	}
// }

const loadOpp = () => {
	loadOpponents();
	oppLoad = true;
}

const startField = () => {
	loading = false;
	obstacleSpeed = 5;
	opponentSpeed = obstacleSpeed * (-10);
}

const finishField = () => {
	finishTime++;
	const width = ctx.measureText(finishPositionText.text).width;
	finishPositionText.x = ((gameField.canvas.width - width) / 2) - 50;
	finishPositionText.y = 200;
	th.x = finishPositionText.x + 60;
	th.y = finishPositionText.y - 5;
	th.update();
	finishPositionText.update();
	
	//ENABLE CENTER BUTTON FOR RESTART
	if(finishTime >= 59 && !checkTimesPlayed) {
		gameField.finish();
		console.log("No of times played: ", timesPlayed)
		checkTimesPlayed = true;
	};
}

// const countTheCountdown = () => {
// 	countDisplay.text = countDown;
// 	countDisplay.color = countDown === 3 
// 		? "red" : countDown === 2
// 		? "yellow" : "green";
// 	const width = ctx.measureText(countDisplay.text).width;
// 	countDisplay.x = ((gameField.canvas.width - width) / 2);
// 	gameField.context.clearRect(countDisplay.x, 89, width, 64);
	
// 	countDisplay.y = 150;
// 	countDisplay.update();
// }


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
	if(obsN <= 59) {
		if( obsPosition  <= obsStartPoint - 320) {
			gameField.frameNo  = 0;
			obsPosition = obsStartPoint;
		}
	} else {
		if(!finished) {
			let x = obsStartPoint + 320;
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
				
				opponent[i].x < -150 
					? opponents[i].accelerateValue*=2 
					: null;
			} else if(
				opponents[i].checkAccelerate && 
				opponents[i].accelerateTime >= opponents[i].accelerateEndTime
			) {
				opponents[i].accelerateValue = 
					Math.floor(Math.random() * (maxDV - minDV + 1) + minDV);
				opponents[i].accelerateTime = 0;
				opponents[i].checkAccelerate = false;
			}
			
			
			opponent[i].x < -350
				? opponent[i].x = -350:
				null;
			
			opponent[i].countBy = 
				opponents[i].accelerateValue < 30 									?  1 
				: opponents[i].accelerateValue < 100
				? 2 : 3;
				

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
    
    backgroundGrass.speedX = -1;
    backgroundGrass.obsPos(secondsPassed);
    backgroundGrass.update();
    
    const posSt = playerPositionNo === 1 
		? "st" : playerPositionNo === 2 
		? "nd" : playerPositionNo === 3 
		? "rd" : "th";
    playerPosition.text = playerPositionNo != undefined
		? `${playerPositionNo}${posSt}`
		: ' ';
    
//   burnFuel();

  if(finishPositionWritten) {
		finishField();
	} else {
			playerPosition.update();
	};
	
	window.requestAnimationFrame(updateField);
}

const everyinterval = (n) => {
	if ((gameField.frameNo / n) % 1 == 0) {
		return true;
	}
	return false;
}

//CONTROL FUNCTIONS
const moveUp = () => {
	gamePiece.speedY = -50;
}

const moveDown = () => {
	gamePiece.speedY = 50;
}

const clearMove = () => {
    gamePiece.speedX = 0;
    gamePiece.speedY = 0;
    obstacleSpeed = 6;
	opponentSpeed = -100;
};

const pause = () => {         
   fieldAnimate = false;
   fieldPaused = true;
   countDown = 3;
};

const resume = () => {
	if(fieldPaused === false || fieldAnimate === true) {
		return
	};
	fieldPaused = false;
	countTheCountdown();
	const timer = setInterval(() => {
		if(countDown <= 1) {
			fieldAnimate = true;
			clearInterval(timer);
			window.requestAnimationFrame(updateField);
		} else {
			countDown--;
			countTheCountdown();
		}
	}, 800);
};