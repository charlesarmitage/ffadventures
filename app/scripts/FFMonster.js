var ff = (function(ff){

	var Monster = function(name){
		ff.Character.call(this, name);
	};

	Monster.prototype = Object.create(ff.Character.prototype);
	Monster.prototype.constructor = Monster;

	Monster.prototype.fight = function(){
		console.log('Start attacking');

		this.skill.currentValue(parseInt(this.skill.currentValue()));
		this.stamina.currentValue(parseInt(this.stamina.currentValue()));
	};

	var monstersViewModel = {
		currentMonster : new Monster('Unknown'),
		defeatedMonsters : ko.observableArray()
	};
	monstersViewModel.defeatedMonsters.listKey = 'defeatedMonsters';

	ff.monsters = monstersViewModel;
	return ff;
}(ff || {}));
