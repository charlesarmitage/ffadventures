(function(){

	var store = {};
	localStorage.getItem = function (key) {
	  var value = store[key];

	  if(typeof value == 'undefined'){
	  	return null;
	  }
      return value;
    };

    localStorage.setItem = function (key, value) {
      store[key] = value;
    };

    localStorage.removeItem = function (key) {
      delete store[key];
    };

    localStorage.clear = function () {
        store = {};
    };

    clearMockLocalStorage = localStorage.clear;

}());
