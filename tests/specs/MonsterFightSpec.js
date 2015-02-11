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

  it("should minus 2 from monster stamina when monster loses", function() {
    adventurer.skill += 2;

    ffBattle.fightRound(adventurer, monster);

    expect(monster.stamina).toEqual(8);
    expect(adventurer.stamina).toEqual(10);
  });

  it('should minus 2 from adventurer stamina when adventurer loses', function(){
    monster.skill += 2;

    ffBattle.fightRound(adventurer, monster);

    expect(adventurer.stamina).toEqual(8);
    expect(monster.stamina).toEqual(10);
  });

  it('should not change monster or adventurer stamina when draw', function(){

    ffBattle.fightRound(adventurer, monster);

    expect(adventurer.stamina).toEqual(10);
    expect(monster.stamina).toEqual(10);
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

  it('should callback monsterDefeated callback when monster defeated', function(){
    adventurer.skill += 2;
    monster.stamina = 2;
    var calledBack = false;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.checkBattle(result, {
      monsterDefeated: function(defeatedMonster){
        calledBack = true;
        expect(defeatedMonster.stamina).toEqual(0);
      }
    });

    expect(calledBack).toEqual(true);
  });

  it('should callback adventurer callback when adventurer defeated', function(){
    monster.skill += 2;
    adventurer.stamina = 2;
    var calledBack = false;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.checkBattle(result, {
      adventurerDefeated: function(defeatedAdventurer){
        calledBack = true;
        expect(defeatedAdventurer.stamina).toEqual(0);
      }
    });

    expect(calledBack).toEqual(true);
  });

  it('should minus 2 from adventurer stamina when escaping', function(){
    var result = ffBattle.escape(adventurer);

    expect(result.adventurer.stamina).toEqual(8);
  });

  it('should not escape when stamina is 2 or less', function(){
    adventurer.stamina = 2;

    expect(ffBattle.isEscapable(adventurer)).toEqual(false);
  });

  it('should be escapable when stamina is 3 or more', function(){
    expect(ffBattle.isEscapable(adventurer)).toEqual(true);
  });

  it('should have monster winning round when escaping', function(){
    var result = ffBattle.escape(adventurer);

    expect(result.winner).toEqual('Monster');
  });

  it('should increment adventurer stamina by one when adventurer loses round and successfully uses luck', function(){
    adventurer.skill -= 2;
    adventurer.luck = 12;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
  });

  it('should decrement monster stamina by one when adventurer wins round and successfully uses luck', function(){
    adventurer.skill += 2;
    adventurer.luck = 12;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(monster.stamina).toEqual(6);
    expect(adventurer.luck).toEqual(11);
  });

  it('should not change statistics when luck tried for a draw', function(){
    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(12);
    expect(monster.stamina).toEqual(10);
  });

  it('should decrement luck when luck fails for an adventurer winning round', function(){
    adventurer.skill += 2;
    adventurer.luck = 2;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(9);
  });


  it('should restore one stamina to monster when luck fails for an adventurer winning round', function(){
    adventurer.skill += 2;
    adventurer.luck = 2;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(9);
  });


  it('should decrement adventurer stamina by one when luck fails for a monster winning round', function(){
    adventurer.skill -= 2;
    adventurer.luck = 2;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should decrement luck when luck fails for a monster winning round', function(){
    adventurer.skill -= 2;
    adventurer.luck = 2;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should only allow luck to be used once per round', function(){
    adventurer.skill += 2;

    var result = ffBattle.fightRound(adventurer, monster);
    ffBattle.tryLuck(adventurer, monster, result);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(monster.stamina).toEqual(6);
    expect(adventurer.luck).toEqual(11);
  });

  it('should allow luck to be used successfully when escaping', function(){
    adventurer.luck = 12;

    var result = ffBattle.escape(adventurer);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
    expect(monster.stamina).toEqual(10);
  });

  it('should allow luck to be used unsuccessfully when escaping', function(){
    adventurer.luck = 2;

    var result = ffBattle.escape(adventurer);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should only allow luck to be used once per escape', function(){
    adventurer.luck = 12;

    var result = ffBattle.escape(adventurer);
    ffBattle.tryLuck(adventurer, monster, result);
    ffBattle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
    expect(monster.stamina).toEqual(10);
  });
});
