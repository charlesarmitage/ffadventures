describe("Book details", function() {
  var store = {};

  beforeEach(function () {

    spyOn(localStorage, 'getItem').and.callFake(function (key) {
      return store[key];
    });
    spyOn(localStorage, 'setItem').and.callFake(function (key, value) {
      store[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(function () {
        store = {};
    });
  });

  afterEach(function() {
  });

  it('should save numbers to local storage', function() {
    ff.book.branch(102);

    expect(ff.book.branch()).toEqual(102);
  });
});