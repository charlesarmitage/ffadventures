describe("BattleSpec", function() {
  var rollDice = ff.dice.rollTwoDice;
  var adventurer,  monster;
  var viewModelMonster = ff.monsters.currentMonster;

  beforeEach(function() {
    ff.dice.rollTwoDice = function(){
      var roll = rollDice();
      roll.result = 4;
      roll.rolls = [1, 3];
      roll.text = '1 + 3 = 4';
      return roll;
    };

    adventurer = ff.adventurer;
    adventurer.skill.setInitialValue(10);
    adventurer.stamina.setInitialValue(10);
    adventurer.luck.setInitialValue(10);

    monster = {
      skill : 10,
      initialStamina : 10,
      stamina : 10
    };

    viewModelMonster.skill.setInitialValue(10);
    viewModelMonster.stamina.setInitialValue(10);
  });

  afterEach(function() {
    ff.dice.rollTwoDice = rollDice;
  });

  function FightBattleRound(){
    adventurer.attack(viewModelMonster, function(roundResponse){});
  }

  it("decrementing Adventurer stamina changes current value", function() {
      adventurer.stamina.decrementValue(2);

      expect(adventurer.stamina.currentValue()).toEqual(8);
      expect(adventurer.stamina.initialValue()).toEqual(10);
  });

  it("decrementing by one Adventurer stamina changes current value", function() {
      adventurer.stamina.decrement();

      expect(adventurer.stamina.currentValue()).toEqual(9);
      expect(adventurer.stamina.initialValue()).toEqual(10);
  });

  it("incrementing Adventurer stamina changes current value", function() {
      adventurer.stamina.incrementValue(2);

      expect(adventurer.stamina.currentValue()).toEqual(12);
      expect(adventurer.stamina.initialValue()).toEqual(10);
  });

  it("increment by one Adventurer stamina changes current value", function() {
      adventurer.stamina.increment();

      expect(adventurer.stamina.currentValue()).toEqual(11);
      expect(adventurer.stamina.initialValue()).toEqual(10);
  });

  it('Adventurer wins round, monsters stamina should be decremented by 2', function(){
      adventurer.skill.incrementValue(2);

      var result = ffBattle.fightRound(adventurer.toPlainStats(), monster);

      expect(result.winner).toEqual('Adventurer');
      expect(result.monster.stamina).toEqual(monster.initialStamina - 2);
      expect(result.adventurer.stamina).toEqual(adventurer.stamina.initialValue());
  });

  it('Monster wins round, adventurers stamina should be decremented by 2', function(){
      monster.skill += 2;

      var result = ffBattle.fightRound(adventurer.toPlainStats(), monster);

      expect(result.winner).toEqual('Monster');
      expect(result.adventurer.stamina).toEqual(adventurer.stamina.initialValue() - 2);
      expect(result.monster.stamina).toEqual(monster.initialStamina);
  });

  it('Adventurer wins, view model monsters stamina is updated', function()
  {
      adventurer.skill.incrementValue(2);

      var result = ffBattle.fightRound(adventurer.toPlainStats(), viewModelMonster.toPlainStats());
      viewModelMonster.updateViewModel(result.monster);
      adventurer.updateViewModel(result.adventurer);

      expect(viewModelMonster.stamina.currentValue()).toEqual(monster.initialStamina - 2);
      expect(adventurer.stamina.currentValue()).toEqual(adventurer.stamina.initialValue());
  });

  it('Monster wins, view model adventurer stamina is updated', function()
  {
      viewModelMonster.skill.incrementValue(2);

      FightBattleRound();

      expect(viewModelMonster.stamina.currentValue()).toEqual(viewModelMonster.stamina.initialValue());
      expect(adventurer.stamina.currentValue()).toEqual(adventurer.stamina.initialValue() - 2);
  });
});