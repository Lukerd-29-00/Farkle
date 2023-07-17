const NUM_PLAYERS = 2;
const NUM_DICE = 6;

const total_scores = new Array(NUM_PLAYERS);
total_scores.fill(0)

const WINNING_SCORE = 1000;

let player = -1;

const diceArr = [];

let round_score = 0;

let roll_score = 0;

let total_score = 0;

let firstRoll = 0;

let endgame = 0;

let turns_remaining = NUM_PLAYERS - 1;

const config = {
	values: 6,
	singles: [100,0,0,0,50,0],
	triples: [1000, 200, 300, 400, 500, 600]
};


for(let i = 0;i < NUM_PLAYERS;i++){
	const node = document.createElement("div");
	node.classList.add("row","score");
	node.id = `total-score-${i}`;
	node.innerText = 0;
	document.getElementById("scores-row").appendChild(node)
}

function initializeDice(){
	firstRoll = 0;
	document.getElementById("bank").classList.add("locked")
	const imgs = document.getElementsByClassName("image")
	for(let i = 0;i < imgs.length;i++){
		imgs[i].classList.remove("transparent")
	}

	for(i = 0; i < NUM_DICE; i++){
		diceArr[i] = {};
		diceArr[i].id = `die${i+1}`;
		diceArr[i].value = i + 1;
		diceArr[i].clicked = 0;
		diceArr[i].locked = 0;
		document.getElementById(`die${i+1}`).classList.remove("transparent")
		document.getElementById(`die${i+1}`).classList.remove("locked")
	}
	player = (player + 1) % NUM_PLAYERS;
	document.getElementById("player").innerText = `Player ${player+1}'s turn`
}

/*Rolling dice values*/
function rollDice(){
	for(var i=0; i < 6; i++){
		if(diceArr[i].clicked === 0 && diceArr[i].locked === 0){
			diceArr[i].value = Math.floor((Math.random() * 6) + 1);
		}
	}
	round_score += roll_score
	roll_score = 0;
	document.getElementById("round-score").innerText = `${round_score + roll_score}`
	for(let i = 0;i < diceArr.length;i++){
		if(diceArr[i].clicked === 1){
			diceArr[i].locked = 1;
			const img = document.getElementById(`die${i+1}`);
			img.classList.remove("transparent");
			img.classList.add("locked");
		}
	}
	if(calcScore(diceArr.filter(v => {
		return v.locked === 0;
	})) == 0){
		alert("Farkle!");
		initializeDice();
		round_score = 0;
		roll_score = 0;
		document.getElementById("round-score").innerText = `${0}`;
	}
	else{
		firstRoll = 1;
		document.getElementById("bank").classList.remove("locked");
	}
	updateDiceImg();
}

function win(){
	let winners = new Array(0)
	let best_score = 0;
	for(let i = 0;i < total_scores.length;i++){
		if(total_scores[i] > best_score){
			winners = new Array(1);
			winners[0] = i;
			best_score = total_scores[i];
		}else if(total_scores[i] === best_score){
			winners.add(i);
			best_score = total_scores[i];
		}
	}
	document.getElementById("body").innerHTML = "";

	const node = document.createElement("header");
	node.classList.add("row","header");
	node.innerText = winners.length === 1 ? `Player ${winners[0]+1} Wins!` : `Tie!`;

	document.getElementById("body").appendChild(node)
}

function bankScore(){
	if(!firstRoll){
		return
	}
	total_scores[player] += round_score + roll_score;
	round_score = 0;
	roll_score = 0;

	document.getElementById(`total-score-${player}`).innerText = `${total_scores[player]}`;
	document.getElementById("round-score").innerText = `${0}`;

	if(total_scores[player] >= WINNING_SCORE && endgame === 0){
		endgame = 1;
	}else if(endgame === 1){
		turns_remaining--;
	}
	if(turns_remaining <= 0){
		win();
	}

	initializeDice();
	updateDiceImg();
}


function calcScore(dice){
	let score = 0;
	const found = new Map()
	for(let i = 1;i <= config.values; i++){
		found.set(i,0)
	}
	for(let i = 0;i < dice.length; i++){
		const value = dice[i].value
		found.set(value,found.get(value)+1)
	}
	const keys = found.keys()
	for(let key = keys.next(); !key.done; key = keys.next()){
		score += config.triples[key.value-1]*(Math.floor(found.get(key.value)/3))
		score += config.singles[key.value-1]*(found.get(key.value) % 3)
	}
	return score
}

/*Updating images of dice given values of rollDice*/
function updateDiceImg(){
	var diceImage;
	for(var i = 0; i < 6; i++){
		diceImage = `images/${diceArr[i].value}.png`
		document.getElementById(diceArr[i].id).setAttribute("src", diceImage);
	}
}

function diceClick(img){
	if(!firstRoll){
		return
	}
	var i = Number(img.getAttribute("data-number"));
	if(diceArr[i].locked === 1){
		return
	}

	img.classList.toggle("transparent");

	if(diceArr[i].clicked === 0){
		diceArr[i].clicked = 1;
	}
	else{
		diceArr[i].clicked = 0;
	}

	const selected = diceArr.filter(v => {
		return v.clicked === 1 && v.locked === 0;
	});
	roll_score = calcScore(selected)
	document.getElementById("round-score").innerText = round_score + roll_score
}