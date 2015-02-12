describe("Adventurer storage", function() {
	var store = {};

	beforeEach(function() {
		clearMockLocalStorage();
    });

    afterEach(function() {
    	clearMockLocalStorage();
    });

	var expectBlankStoredAdventurer = function(){
	  	expect(localStorage.getItem('adventurerName')).toEqual(null);
	  	expect(localStorage.getItem('initialSkill')).toEqual(null);
	  	expect(localStorage.getItem('initialStamina')).toEqual(null);
	  	expect(localStorage.getItem('initialLuck')).toEqual(null);
	  	expect(localStorage.getItem('currentSkill')).toEqual(null);
	  	expect(localStorage.getItem('currentStamina')).toEqual(null);
	  	expect(localStorage.getItem('currentLuck')).toEqual(null);
	  	expect(localStorage.getItem('equipmentItemsList')).toEqual(null);
	  	expect(localStorage.getItem('treasureItemsList')).toEqual(null);
	  	expect(localStorage.getItem('notesList')).toEqual(null);
	};

  it("should load blank adventurer when no adventurer is stored", function() {
  	ff.adventurerStorage.loadAdventurer(ff.adventurer);

  	expect(ff.adventurer.name()).toEqual('...');

  	expect(ff.adventurer.stamina.initialValue()).toEqual(0);
  	expect(ff.adventurer.stamina.currentValue()).toEqual(0);
  	expect(ff.adventurer.skill.initialValue()).toEqual(0);
  	expect(ff.adventurer.skill.currentValue()).toEqual(0);
   	expect(ff.adventurer.luck.initialValue()).toEqual(0);
  	expect(ff.adventurer.luck.currentValue()).toEqual(0);
  	expect(ff.adventurer.equipmentItemsList()).toEqual([]);
  	expect(ff.adventurer.treasureItemsList()).toEqual([]);
  	expect(ff.adventurer.notesList()).toEqual([]);
  });

  it("should have blank local storage when no adventurer is stored", function() {
  	ff.adventurerStorage.loadAdventurer(ff.adventurer);

  	expectBlankStoredAdventurer();
  });

  it("should store adventurer when adventurer properties are changed", function() {
  	ff.adventurerStorage.loadAdventurer(ff.adventurer);

  	ff.adventurer.name('bob');
  	ff.adventurer.stamina.initialValue(5);
  	ff.adventurer.stamina.currentValue(4);
  	ff.adventurer.skill.initialValue(6);
  	ff.adventurer.skill.currentValue(5);
   	ff.adventurer.luck.initialValue(2);
  	ff.adventurer.luck.currentValue(1);

  	ff.adventurer.equipmentItemsList(['1', '2']);
  	ff.adventurer.treasureItemsList(['g1', 'g2']);
  	ff.adventurer.notesList(['n1', 'n2']);

	expect(localStorage.getItem('adventurerName')).toEqual('bob');
  	expect(localStorage.getItem('initialSkill')).toEqual(6);
  	expect(localStorage.getItem('initialStamina')).toEqual(5);
  	expect(localStorage.getItem('initialLuck')).toEqual(2);
  	expect(localStorage.getItem('currentSkill')).toEqual(5);
  	expect(localStorage.getItem('currentStamina')).toEqual(4);
  	expect(localStorage.getItem('currentLuck')).toEqual(1);
  	expect(localStorage.getItem('equipmentItemsList')).toEqual(JSON.stringify(['1', '2']));
  	expect(localStorage.getItem('treasureItemsList')).toEqual(JSON.stringify(['g1', 'g2']));
  	expect(localStorage.getItem('notesList')).toEqual(JSON.stringify(['n1', 'n2']));
  });

	it('should have blank storage when an adventurer is reset', function(){
		ff.adventurerStorage.loadAdventurer(ff.adventurer);

		ff.adventurer.name('bob');
	  	ff.adventurer.stamina.initialValue(5);
	  	ff.adventurer.stamina.currentValue(4);
	  	ff.adventurer.skill.initialValue(6);
	  	ff.adventurer.skill.currentValue(5);
	   	ff.adventurer.luck.initialValue(2);
	  	ff.adventurer.luck.currentValue(1);

	  	ff.adventurer.reset();
	  	ff.adventurerStorage.removeAdventurer(ff.adventurer);

	  	expectBlankStoredAdventurer();
	});

	it('should read from storage when an adventurer is loaded', function(){
		localStorage.setItem('adventurerName', 'bob');
		localStorage.setItem('initialSkill', '6');
		localStorage.setItem('initialStamina', '5');
		localStorage.setItem('initialLuck', '2');
		localStorage.setItem('currentSkill', '5');
		localStorage.setItem('currentStamina', '4');
		localStorage.setItem('currentLuck', '1');
		localStorage.setItem('equipmentItemsList', JSON.stringify([{name : '1'}, {name : '2'}]));
		localStorage.setItem('treasureItemsList', JSON.stringify([{name: 'g1'}, {name: 'g2'}]));
		localStorage.setItem('notesList', JSON.stringify([{name: 'n1'}, {name: 'n2'}]));

		ff.adventurerStorage.loadAdventurer(ff.adventurer);

		expect(ff.adventurer.name()).toEqual('bob');
	  	expect(ff.adventurer.stamina.initialValue()).toEqual(5);
	  	expect(ff.adventurer.stamina.currentValue()).toEqual(4);
	  	expect(ff.adventurer.skill.initialValue()).toEqual(6);
	  	expect(ff.adventurer.skill.currentValue()).toEqual(5);
	   	expect(ff.adventurer.luck.initialValue()).toEqual(2);
	  	expect(ff.adventurer.luck.currentValue()).toEqual(1);

	  	var list = ko.toJS(ff.adventurer.equipmentItemsList());
	  	expect(list).toEqual([{name : '1', isEditable : false, count : 1},
	  						 {name : '2', isEditable : false, count : 1}]);
	  	list = ko.toJS(ff.adventurer.treasureItemsList());
	  	expect(list).toEqual([{name : 'g1', isEditable : false, count : 1},
	  						 {name : 'g2', isEditable : false, count : 1}]);
	  	list = ko.toJS(ff.adventurer.notesList());
	  	expect(list).toEqual([{name : 'n1', isEditable : false, count : 1},
	  						 {name : 'n2', isEditable : false, count : 1}]);
	});
});