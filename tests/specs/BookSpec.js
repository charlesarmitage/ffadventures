describe("Book details", function() {
  
  beforeEach(function () {
    clearMockLocalStorage();
  });

  afterEach(function() {
  });

  it('should save numbers to local storage', function() {
    ff.book.branch(102);

    expect(ff.book.branch()).toEqual(102);
  });
});