var ff = (function(ff){

	var Statistic = function(name){
		this.name = name;
		this.currentValue = ko.observable(0);
		this.initialValue = ko.observable(0);
	};

	Statistic.prototype.setInitialValue = function(value){
		this.initialValue(value);
		this.currentValue(value);
	};

	Statistic.prototype.increment = function () {
		this.incrementValue(1);
	};

	Statistic.prototype.incrementInitial = function () {
		this.initialValue(parseInt(this.initialValue()) + 1);
	};

	Statistic.prototype.incrementValue = function(value) {
		this.currentValue(parseInt(this.currentValue()) + value);
	};

	Statistic.prototype.decrement = function () {
		this.decrementValue(1);
	};

	Statistic.prototype.decrementInitial = function () {
		this.initialValue(parseInt(this.initialValue()) - 1);
	};

	Statistic.prototype.decrementValue = function(value) {
		this.currentValue(parseInt(this.currentValue()) - value);
	};

	Statistic.prototype.reset = function(){
		this.currentValue(0);
		this.initialValue(0);
	};

	var Character = function Character(name){
		this.name = ko.observable(name);
		this.skill = new ff.Statistic('Skill');
		this.stamina = new ff.Statistic('Stamina');
		this.statistics = [ this.skill, 
							this.stamina];
	};

	Character.prototype.toPlainStats = function(){
        return {
          name : this.name(),
          skill : this.skill.currentValue(),
          initialStamina : this.stamina.initialValue(),
          stamina : this.stamina.currentValue()
        };
    };

    Character.prototype.updateViewModel = function(character){
    	this.stamina.currentValue(character.stamina);
    };

    ff.Statistic = Statistic;
    ff.Character = Character;

    return ff;
}(ff || {}));
