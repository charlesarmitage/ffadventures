var ff = (function(ff){

	var adventurer = Object.create(new ff.Character('...'));
	ff.adventurer = initialize(adventurer);


	function initialize(adventurer){
		adventurer.luck = new ff.Statistic('Luck');
		adventurer.statistics.push(adventurer.luck);

		adventurer.name.subscribe(function(name){
			localStorage.setItem('adventurerName', name);
		});

		for(var statistic in adventurer.statistics){
			ff.storage.loadFromStorage(adventurer.statistics[statistic]);
			ff.storage.subscribeToStatistic(adventurer.statistics[statistic]);
		}

		var storedName = localStorage.getItem('adventurerName');
		if(storedName !== null && storedName != 'undefined'){
			adventurer.name(storedName);
		}

		adventurer.isNameEditable = ko.observable(false);
		return adventurer;
	}

	adventurer.editName = function() { 
		adventurer.isNameEditable(true);
	};

	adventurer.toPlainStats = function(){
		var stats = ff.Character.prototype.toPlainStats.call(adventurer);
		stats.luck = adventurer.luck.currentValue();
		return stats;
	};

	adventurer.updateViewModel = function(plainAdventurer){
		ff.Character.prototype.updateViewModel.call(adventurer, plainAdventurer);
		adventurer.luck.currentValue(plainAdventurer.luck);
	};

	adventurer.reset = function(){
		for(var statistic in adventurer.statistics){
			var stat = adventurer.statistics[statistic];
			adventurer.statistics[statistic].reset();
			ff.storage.remove(stat);
		}
		ff.adventurer.equipmentItemsList([]);
		ff.adventurer.treasureItemsList([]);
		ff.adventurer.notesList([]);

		ff.storage.resetList(adventurer.equipmentItemsList);
		ff.storage.resetList(adventurer.treasureItemsList);
		ff.storage.resetList(adventurer.notesList);
	};

	adventurer.newEquipmentItem = ko.observable('');
	adventurer.equipmentItemsList = ko.observableArray();
	adventurer.equipmentItemsList.listKey = 'equipmentItemsList';
	ff.storage.connectListToStorage(adventurer.equipmentItemsList);

	adventurer.newTreasureItem = ko.observable('');
	adventurer.treasureItemsList = ko.observableArray();
	adventurer.treasureItemsList.listKey = 'treasureItemsList';
	ff.storage.connectListToStorage(adventurer.treasureItemsList);

	adventurer.newNote = ko.observable('');
	adventurer.notesList = ko.observableArray();
	adventurer.notesList.listKey = 'notesList';
	ff.storage.connectListToStorage(adventurer.notesList);

	adventurer.attack = function(monster, roundResponse){
		adventurer.lastRoundResult = ffBattle.fightRound(adventurer.toPlainStats(), monster.toPlainStats());
		adventurer.updateViewModel(adventurer.lastRoundResult.adventurer);
		monster.updateViewModel(adventurer.lastRoundResult.monster);

		roundResponse(adventurer.lastRoundResult);
	};

	adventurer.continueBattle = function(endBattleResponse){
		ffBattle.checkBattle(adventurer.lastRoundResult, endBattleResponse);
	};

	adventurer.escape = function(escapeResponse){
		adventurer.lastRoundResult = ffBattle.escape(adventurer.toPlainStats());
		adventurer.updateViewModel(adventurer.lastRoundResult.adventurer);
		escapeResponse();
	};

	adventurer.tryLuck = function(){
		ffBattle.tryLuck(adventurer.lastRoundResult.adventurer,
						 adventurer.lastRoundResult.monster,
						 adventurer.lastRoundResult);
		adventurer.updateViewModel(adventurer.lastRoundResult.adventurer);
	};

	adventurer.testLuck = function(){
		var currentLuck = adventurer.luck.currentValue();
		adventurer.luck.currentValue(currentLuck - 1);

		return currentLuck >= ff.dice.rollTwoDice().result;
	};

	return ff;
}(ff || {}));
