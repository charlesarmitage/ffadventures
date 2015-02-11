describe("RollOneDie", function() {
  var roll;

  beforeEach(function() {
    roll = ff.dice.rollOneDie();
  });

  it("should be able to roll one six sided die", function() {
    expect(roll.result).toBeGreaterThan(0);
    expect(roll.result).toBeLessThan(7);
  });

  it('should return array of results of length one', function(){
    expect(roll.rolls.length).toEqual(1);
  });

  it('should have equal result and sum of rolls', function(){
    expect(roll.rolls[0]).toEqual(roll.result);
  });

  it('should convert result to text', function(){
    expect(roll.text).toMatch(' = [1-6]');
  });

  it('should add the modifier to the roll result', function(){
    roll.add(10);

    expect(roll.result).toBeGreaterThan(10);
    expect(roll.result).toBeLessThan(17);
  });

  it('should convert result with modifer to text', function(){
    roll.add(10);

    expect(roll.text).toMatch(/[1-6] \+ 10 = \d/);
  });

});