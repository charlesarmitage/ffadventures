var ffFormat = (function(){
	function formatBattleRoundResult(result){
		var winnerText = result.winner + ' hits!';
		if(result.winner == 'Draw'){
			winnerText = 'Draw!';
		}

		return 'Adventurer: ' +
				result.adventurerResult.text + '\n' +
				'Monster: ' +
				result.monsterResult.text + '\n' +
				winnerText;
	}

	return {
		formatBattleRound : formatBattleRoundResult
	};
}(ffFormat || {}));
