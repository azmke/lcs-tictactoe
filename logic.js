const PLAYER = {
	user: "x",
	computer: "o"
};

const RESULT = {
	computer: 0,
	user: 1,
	tie: 2,
	running: 3
};

let REWARD = {
	learnrate: 0.05,
	default: 50,
	won: 100,
	tie: 50,
	lost: -100,
	decrease_rate: 0.1
}

let COUNTER = {
	total: 0,
	wins: 0,
	ties: 0,
	losses: 0
}

let GAME = {
	state: Array(10).join(" "),
	ruleset: [],
	actions: [],
	turn: PLAYER.user
}

String.prototype.replaceAt = function(index, replacement) {
	return this.substr(0, index) + replacement + this.substr(index + replacement.length);
};

const train = (cycles = 1000) => {
	GAME.state = Array(10).join(" ");
	GAME.actions = [];

	let counter = cycles;
	while (counter > 0) {
		if (GAME.turn == PLAYER.computer) {
			move_computer();
		} else {
			move_random();
		}

		GAME.turn = GAME.turn == PLAYER.user ? PLAYER.computer : PLAYER.user;

		let result = get_result();
		if (result == RESULT.computer) {
			reward(REWARD.won);
			COUNTER.wins++;
		} else if (result == RESULT.user) {
			reward(REWARD.lost);
			COUNTER.losses++;
		} else if (result == RESULT.tie) {
			reward(REWARD.tie);
			COUNTER.ties++;
		} else {
			continue;
		}

		GAME.state = Array(10).join(" ");
		GAME.actions = [];
		counter--;
	}
}

const move_computer = () => {
	let matchset = [];
	for (let rule of GAME.ruleset) {
		if (rule.state == GAME.state) {
			matchset.push(rule);
		}
	}

	let actionset = [],
		action = null;

	if (matchset.length > 0) {
		let reward_max = 0;

		for (let pos_i = 0; pos_i < GAME.state.length; pos_i++) {
			let set = [],
				rewards_sum = 0;

			for (let rule of matchset) {
				if (rule.action == pos_i) {
					set.push(rule);
					rewards_sum += rule.reward;
				}
			}

			let rewards_avg = rewards_sum / set.length;
			if (rewards_avg >= reward_max) {
				actionset = set;
				action = pos_i;
				reward_max = rewards_avg;
			}
		}
	} else {
		let set = [];
		for (let pos_i = 0; pos_i < GAME.state.length; pos_i++) {
			if (GAME.state[pos_i] == " ") {	
				let rule = {
					state: GAME.state,
					action: pos_i,
					reward: REWARD.default
				};

				set.push(rule);
				GAME.ruleset.push(rule);
			}
		}

		let rule = set[Math.floor(Math.random() * set.length)];
		actionset.push(rule);
		action = rule.action;
	}

	GAME.actions.unshift(actionset);
	GAME.state = GAME.state.replaceAt(action, PLAYER.computer);
}

const move_random = () => {
	let empty_cells = [];
	for (let pos_i = 0; pos_i < GAME.state.length; pos_i++) {
		if (GAME.state[pos_i] == " ") {
			empty_cells.push(pos_i);
		}
	}

	let action = empty_cells[Math.floor(Math.random() * empty_cells.length)];
	GAME.state = GAME.state.replaceAt(action, PLAYER.user);
}

const get_result = () => {
	if ((GAME.state[0] === PLAYER.computer && GAME.state[1] === PLAYER.computer && GAME.state[2] === PLAYER.computer) ||
		(GAME.state[3] === PLAYER.computer && GAME.state[4] === PLAYER.computer && GAME.state[5] === PLAYER.computer) ||
		(GAME.state[6] === PLAYER.computer && GAME.state[7] === PLAYER.computer && GAME.state[8] === PLAYER.computer) ||
		(GAME.state[0] === PLAYER.computer && GAME.state[3] === PLAYER.computer && GAME.state[6] === PLAYER.computer) ||
		(GAME.state[1] === PLAYER.computer && GAME.state[4] === PLAYER.computer && GAME.state[7] === PLAYER.computer) ||
		(GAME.state[2] === PLAYER.computer && GAME.state[5] === PLAYER.computer && GAME.state[8] === PLAYER.computer) ||
		(GAME.state[0] === PLAYER.computer && GAME.state[4] === PLAYER.computer && GAME.state[8] === PLAYER.computer) ||
		(GAME.state[2] === PLAYER.computer && GAME.state[4] === PLAYER.computer && GAME.state[6] === PLAYER.computer)) {
		return RESULT.computer;
	} else if((GAME.state[0] === PLAYER.user && GAME.state[1] === PLAYER.user && GAME.state[2] === PLAYER.user) ||
		(GAME.state[3] === PLAYER.user && GAME.state[4] === PLAYER.user && GAME.state[5] === PLAYER.user) ||
		(GAME.state[6] === PLAYER.user && GAME.state[7] === PLAYER.user && GAME.state[8] === PLAYER.user) ||
		(GAME.state[0] === PLAYER.user && GAME.state[3] === PLAYER.user && GAME.state[6] === PLAYER.user) ||
		(GAME.state[1] === PLAYER.user && GAME.state[4] === PLAYER.user && GAME.state[7] === PLAYER.user) ||
		(GAME.state[2] === PLAYER.user && GAME.state[5] === PLAYER.user && GAME.state[8] === PLAYER.user) ||
		(GAME.state[0] === PLAYER.user && GAME.state[4] === PLAYER.user && GAME.state[8] === PLAYER.user) ||
		(GAME.state[2] === PLAYER.user && GAME.state[4] === PLAYER.user && GAME.state[6] === PLAYER.user)) {
		return RESULT.user;
	} else if (GAME.state.indexOf(" ") == -1) {
		return RESULT.tie;
	} else {
		return RESULT.running;
	}
}

const reward = (reward) => {
	for (let actionset of GAME.actions) {
		for (let rule of actionset) {
			rule.reward = (1 - REWARD.learnrate) * rule.reward + REWARD.learnrate * reward;
			if (rule.reward < 0) {
				rule.reward = 0;
			}
		}
		reward *= (1 - REWARD.decrease_rate);
	}
}