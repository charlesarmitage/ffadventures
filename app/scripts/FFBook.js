var ff = (function(ff){
	ff.book = {};

	function loadInt(name) {
		if(localStorage.getItem(name) === null){
			return 0;
		}
		return parseInt(localStorage.getItem(name));
	}

	ff.book.branch = ko.observable(loadInt('branch'));
	ff.book.branch.subscribe(function(newValue){
		localStorage.setItem('branch', newValue);
	});

	ff.book.branch.reset = function(){
		ff.book.branch(0);
		localStorage.removeKey('branch');
	};

	ff.book.diceResult = ko.observable('...');
	ff.book.number = ko.observable(1);

	return ff;

}(ff || {}));