describe("Adventurer and Monster Fight", function() {
  var rollDice = ff.dice.rollTwoDice,
  adventurer,
  monster;

  beforeEach(function() {
    ff.dice.rollTwoDice = function(){
      var roll = rollDice();
      roll.result = 4;
      roll.rolls = [1, 3];
      roll.text = '1 + 3 = 4';
      return roll;
    };

    adventurer = {
      skill : 10,
      initialStamina : 10,
      stamina : 10,
      luck : 12
    };

    monster = {
      skill : 10,
      initialStamina : 10,
      stamina : 10
    };
  });

  afterEach(function() {
    ff.dice.rollTwoDice = rollDice;
  });

  it('should format adventurer wins result', function(){
    adventurer.skill += 2;

    var result = ffBattle.fightRound(adventurer, monster);

    expect(ffFormat.formatBattleRound(result))
      .toEqual(
'Adventurer: 1 + 3 + 12 = 16\n' +
'Monster: 1 + 3 + 10 = 14\n' +
'Adventurer hits!');
  });

  it('should format monster wins result', function(){
    monster.skill += 2;

    var result = ffBattle.fightRound(adventurer, monster);

    expect(ffFormat.formatBattleRound(result))
      .toEqual(
'Adventurer: 1 + 3 + 10 = 14\n' +
'Monster: 1 + 3 + 12 = 16\n' +
'Monster hits!');
  });


  it('should format draw result', function(){

    var result = ffBattle.fightRound(adventurer, monster);

    expect(ffFormat.formatBattleRound(result))
      .toEqual(
'Adventurer: 1 + 3 + 10 = 14\n' +
'Monster: 1 + 3 + 10 = 14\n' +
'Draw!');
  });
});
