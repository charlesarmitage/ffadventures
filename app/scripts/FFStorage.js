var ff = (function(ff){

	ff.storage = {};

	function loadStat(stat) {
		return parseInt(localStorage.getItem(stat) || 0);
	}

	ff.storage.loadFromStorage = function(statistic){
		statistic.initialValue(loadStat("initial" + statistic.name));
		statistic.currentValue(loadStat("current" + statistic.name));
	}

	ff.storage.saveToStorage = function(statistic){
		console.log("Stat changed: " + statistic.name + ", " + statistic.currentValue());

		localStorage.setItem("initial" + statistic.name, statistic.initialValue());
		localStorage.setItem("current" + statistic.name, statistic.currentValue());
	};

	ff.storage.remove = function(statistic){
		console.log("Removing: " + statistic.name);

		localStorage.removeItem("initial" + statistic.name);
		localStorage.removeItem("current" + statistic.name);	
	};

	ff.storage.subscribeToStatistic = function(statistic){
		console.log("Subscribing: " + statistic.name);
		statistic.currentValue.subscribe(function(newValue){
			ff.storage.saveToStorage(statistic);
		});
	}

	function addNewItem(item){
		return {
			to : function (list){
				var listKey = list.listKey;

				item.name = ko.observable(item.name || '?');
				item.name.subscribe(function(newValue){
						localStorage.setItem(listKey, JSON.stringify(ko.toJS(list)));
				});				

				item.isEditable = ko.observable(false);
				item.isEditable.subscribe(function(newValue){
					localStorage.setItem(listKey, JSON.stringify(ko.toJS(list)));
				});

				item.count = ko.observable(item.count || 1);
				item.count.subscribe(function(newValue){
					localStorage.setItem(listKey, JSON.stringify(ko.toJS(list)));
				});
				list.push(item);
			}
		};		
	}

	ff.storage.connectListToStorage = function(list){
		var listKey = list.listKey;
		var storedList = localStorage.getItem(listKey) || "[]";
		storedList = JSON.parse(storedList);

		for (var i = 0; i < storedList.length; i++) {
			addNewItem(storedList[i]).to(list);
		}

		list.subscribe(function(newValue){
			localStorage.setItem(listKey, JSON.stringify(ko.toJS(list)));
		});

		return list;
	};

	ff.storage.resetList = function(list){
		list.removeAll();
		localStorage.removeItem(list.listKey);
	};

	return ff;
}(ff || {}));