var diceArr = [];

NUM_DICE = 6;

let round_score = 0;

let roll_score = 0;

let total_score = 0;

let firstRoll = 0;

const config = {
	values: 6,
	singles: [100,0,0,0,50,0],
	triples: [1000, 200, 300, 400, 500, 600]
};


function initializeDice(){
	firstRoll = 0;
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
	}
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
		}
	}
	if(calcScore(diceArr.filter(v => {
		return v.locked === 0
	})) == 0){
		alert("Farkle!")
		initializeDice();
		round_score = 0;
		roll_score = 0;
		document.getElementById("round-score").innerText = `${0}`
	}
	else{
		firstRoll = 1;
	}
	updateDiceImg();
}

function bankScore(){
	if(!firstRoll){
		return
	}
	total_score += round_score + roll_score;
	initializeDice();
	round_score = 0;
	roll_score = 0;

	document.getElementById("total-score").innerText = `${total_score}`
	document.getElementById("round-score").innerText = `${0}`
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
		if(found.get(key.value) >= 3)
			score += config.triples[key.value-1]*(Math.floor(found.get(key.value)/3))
		else
			score += config.singles[key.value-1]*found.get(key.value)
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