var ff = (function(ff){

	var Dice = function(){
	};

	function rollSingleDie(){
		return Math.floor(Math.random() * 6) + 1;
	}

	var Roll = function(){
		this.result = 0;
		this.rolls = [];
		this.text = '';
	};

	Roll.prototype.add = function(modifier){
		this.modifier = modifier;
		this.result += modifier;
		this.text = rollPlusModifierToText(this, modifier);
		return this;
	};

	function rollPlusModifierToText(roll, modifier){
		return rollsToText(roll.rolls) + ' + ' + roll.modifier + ' = ' + roll.result;
	}

	function rollsToText(rolls){
		var text = '';
		for(var i = 0; i < rolls.length; i++){
			text += rolls[i];
			if(i < rolls.length - 1){
				text += ' + ';
			}
		}
		return text;
	}

	function toText(rolls, result){
		var text = '';
		if(rolls.length > 1){
			text = rollsToText(rolls);
		}
		return text + ' = ' + result;
	}

	function sumRolls(rolls){
		var result = 0;
		for(var i = 0; i < rolls.length; i++){
			result += rolls[i];
		}
		return result;
	}

	function rollDice(numberOfDice){
		var roll = new Roll();
		for(var i = 0; i < numberOfDice; i++){
			roll.rolls.push(rollSingleDie());
		}

		roll.result = sumRolls(roll.rolls);
		roll.text = toText(roll.rolls, roll.result);

		return roll;	
	}

	Dice.prototype.rollOneDie = function(){
		return rollDice(1);
	};

	Dice.prototype.rollTwoDice = function(){
		return rollDice(2);
	};

	ff.dice = new Dice();

	return ff;
}(ff || {}));