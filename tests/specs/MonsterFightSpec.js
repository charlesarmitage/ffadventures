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

    ff.battle.fightRound(adventurer, monster);

    expect(monster.stamina).toEqual(8);
    expect(adventurer.stamina).toEqual(10);
  });

  it('should minus 2 from adventurer stamina when adventurer loses', function(){
    monster.skill += 2;

    ff.battle.fightRound(adventurer, monster);

    expect(adventurer.stamina).toEqual(8);
    expect(monster.stamina).toEqual(10);
  });

  it('should not change monster or adventurer stamina when draw', function(){

    ff.battle.fightRound(adventurer, monster);

    expect(adventurer.stamina).toEqual(10);
    expect(monster.stamina).toEqual(10);
  });

  it('monster should be dead when monster is defeated', function(){
    adventurer.skill += 2;
    monster.stamina = 2;

    var result = ff.battle.fightRound(adventurer, monster);

    var defeatedMonster = Object.create(new ff.Character('...'));
    defeatedMonster.updateViewModel(result.monster);

    expect(monster.stamina).toEqual(0);
    expect(defeatedMonster.isAlive()).toEqual(false);
  });

  it('should callback monsterDefeated callback when monster defeated', function(){
    adventurer.skill += 2;
    monster.stamina = 2;
    var calledBack = false;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.checkBattle(result, {
      monsterDefeated: function(defeatedMonster){
        calledBack = true;
        expect(defeatedMonster.stamina).toEqual(0);
      }
    });

    expect(calledBack).toEqual(true);
  });

  it('adventurer should be dead when adventurer is defeated', function(){
    monster.skill += 2;
    adventurer.stamina = 2;

    var result = ff.battle.fightRound(adventurer, monster);

    ff.adventurer.updateViewModel(result.adventurer);

    expect(adventurer.stamina).toEqual(0);
    expect(ff.adventurer.isAlive()).toEqual(false);
  });

  it('should callback adventurer callback when adventurer defeated', function(){
    monster.skill += 2;
    adventurer.stamina = 2;
    var calledBack = false;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.checkBattle(result, {
      adventurerDefeated: function(defeatedAdventurer){
        calledBack = true;
        expect(defeatedAdventurer.stamina).toEqual(0);
      }
    });

    expect(calledBack).toEqual(true);
  });

  it('should minus 2 from adventurer stamina when escaping', function(){
    var result = ff.battle.escape(adventurer);

    expect(result.adventurer.stamina).toEqual(8);
  });

  it('should not escape when stamina is 2 or less', function(){
    adventurer.stamina = 2;

    expect(ff.battle.isEscapable(adventurer)).toEqual(false);
  });

  it('should be escapable when stamina is 3 or more', function(){
    expect(ff.battle.isEscapable(adventurer)).toEqual(true);
  });

  it('should have monster winning round when escaping', function(){
    var result = ff.battle.escape(adventurer);

    expect(result.winner).toEqual('Monster');
  });

  it('should increment adventurer stamina by one when adventurer loses round and successfully uses luck', function(){
    adventurer.skill -= 2;
    adventurer.luck = 12;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
  });

  it('should decrement monster stamina by one when adventurer wins round and successfully uses luck', function(){
    adventurer.skill += 2;
    adventurer.luck = 12;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(monster.stamina).toEqual(6);
    expect(adventurer.luck).toEqual(11);
  });

  it('should not change statistics when luck tried for a draw', function(){
    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(12);
    expect(monster.stamina).toEqual(10);
  });

  it('should decrement luck when luck fails for an adventurer winning round', function(){
    adventurer.skill += 2;
    adventurer.luck = 2;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(9);
  });


  it('should restore one stamina to monster when luck fails for an adventurer winning round', function(){
    adventurer.skill += 2;
    adventurer.luck = 2;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(10);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(9);
  });


  it('should decrement adventurer stamina by one when luck fails for a monster winning round', function(){
    adventurer.skill -= 2;
    adventurer.luck = 2;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should decrement luck when luck fails for a monster winning round', function(){
    adventurer.skill -= 2;
    adventurer.luck = 2;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should only allow luck to be used once per round', function(){
    adventurer.skill += 2;

    var result = ff.battle.fightRound(adventurer, monster);
    ff.battle.tryLuck(adventurer, monster, result);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(monster.stamina).toEqual(6);
    expect(adventurer.luck).toEqual(11);
  });

  it('should allow luck to be used successfully when escaping', function(){
    adventurer.luck = 12;

    var result = ff.battle.escape(adventurer);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
    expect(monster.stamina).toEqual(10);
  });

  it('should allow luck to be used unsuccessfully when escaping', function(){
    adventurer.luck = 2;

    var result = ff.battle.escape(adventurer);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(7);
    expect(adventurer.luck).toEqual(1);
    expect(monster.stamina).toEqual(10);
  });

  it('should only allow luck to be used once per escape', function(){
    adventurer.luck = 12;

    var result = ff.battle.escape(adventurer);
    ff.battle.tryLuck(adventurer, monster, result);
    ff.battle.tryLuck(adventurer, monster, result);

    expect(adventurer.stamina).toEqual(9);
    expect(adventurer.luck).toEqual(11);
    expect(monster.stamina).toEqual(10);
  });
});
