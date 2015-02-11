describe("RollTwoDice", function() {
  var roll;

  beforeEach(function() {
    roll = ff.dice.rollTwoDice();
  });

  it("should be able to roll two six sided die", function() {
    expect(roll.result).toBeGreaterThan(1);
    expect(roll.result).toBeLessThan(13);
  });

  it('should return array of results of length two', function(){
    expect(roll.rolls.length).toEqual(2);
  });

  it('should have equal result and sum of rolls', function(){
    expect(roll.rolls[0] + roll.rolls[1]).toEqual(roll.result);
  });

  it('should convert result to text', function(){
    expect(roll.text).toMatch(/[1-6] \+ [1-6] = \d*/);
  });

  it('should add modifier to result', function(){
    roll.add(10);

    expect(roll.result).toBeGreaterThan(11);
    expect(roll.result).toBeLessThan(23);      
  });

  it('should convert result with modifer to text', function(){
    roll.add(10);

    expect(roll.text).toMatch(/[1-6] \+ [1-6] \+ 10 = \d*/);
  });
});