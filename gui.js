const ICON = {
	user: "❌",
	computer: "⚪"
};

const ELEMENTS = {
	canvas: document.getElementById("playground"),

	winner_notice: document.getElementById("winner-notice"),
	button_newgame: document.getElementById("button-newgame"),

	learnrate: document.getElementById("learnrate"),
	learnrate_value: document.getElementById("learnrate-value"),
	reward_default: document.getElementById("reward-default"),
	reward_won: document.getElementById("reward-won"),
	reward_tie: document.getElementById("reward-tie"),
	reward_lost: document.getElementById("reward-lost"),
	decrease_rate: document.getElementById("decrease-rate"),
	decrease_rate_value: document.getElementById("decrease-rate-value"),
	cycles: document.getElementById("cycles"),
	button_train: document.getElementById("button-train"),

	cycles_total: document.getElementById("cycles-total"),
	wins_total: document.getElementById("wins-total"),
	ties_total: document.getElementById("ties-total"),
	losses_total: document.getElementById("losses-total"),

	ruleset: document.getElementById("ruleset")
};

const ctx = ELEMENTS.canvas.getContext("2d");

const paint = () => {
	ctx.clearRect(0, 0, 300, 300);

	ctx.beginPath();
	ctx.moveTo(0, 100);
	ctx.lineTo(300, 100);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, 200);
	ctx.lineTo(300, 200);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(100, 0);
	ctx.lineTo(100, 300);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(200, 0);
	ctx.lineTo(200, 300);
	ctx.stroke();

	ctx.font = "50px Arial";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	for (let pos_i = 0; pos_i < GAME.state.length; pos_i++) {
		if (GAME.state[pos_i] === PLAYER.computer) {
			ctx.fillText(ICON.computer, (pos_i % 3) * 100 + 50, Math.floor(pos_i / 3) * 100 + 50);
		} else if (GAME.state[pos_i] === PLAYER.user) {
			ctx.fillText(ICON.user, (pos_i % 3) * 100 + 50, Math.floor(pos_i / 3) * 100 + 50);
		}
	}
}

window.addEventListener("load", paint);

ELEMENTS.learnrate.addEventListener("change", (event) => {
	ELEMENTS.learnrate_value.innerHTML = event.target.value;
});

ELEMENTS.decrease_rate.addEventListener("change", (event) => {
	ELEMENTS.decrease_rate_value.innerHTML = event.target.value;
});

ELEMENTS.button_train.addEventListener("click", (event) => {
	REWARD.learnrate = ELEMENTS.learnrate.value;
	REWARD.default = ELEMENTS.reward_default.value;
	REWARD.won = ELEMENTS.reward_won.value;
	REWARD.tie = ELEMENTS.reward_tie.value;
	REWARD.lost = ELEMENTS.reward_lost.value;
	REWARD.decrease_rate = ELEMENTS.decrease_rate.value;

	train(ELEMENTS.cycles.value);

	COUNTER.total = COUNTER.wins + COUNTER.ties + COUNTER.losses;

	ELEMENTS.cycles_total.innerHTML = COUNTER.total;
	ELEMENTS.wins_total.innerHTML = (COUNTER.wins / COUNTER.total * 100).toFixed(2) + " %";
	ELEMENTS.ties_total.innerHTML = (COUNTER.ties / COUNTER.total * 100).toFixed(2) + " %";
	ELEMENTS.losses_total.innerHTML = (COUNTER.losses / COUNTER.total * 100).toFixed(2) + " %";
	ELEMENTS.ruleset.innerHTML = GAME.ruleset.length;

	/*console.log(`Training completed!\n` +
		`Wins:		${COUNTER.wins} (${(COUNTER.wins / COUNTER.total * 100).toFixed(2)} %)\n` +
		`Ties:		${COUNTER.ties} (${(COUNTER.ties / COUNTER.total * 100).toFixed(2)} %)\n` +
		`Losses:		${COUNTER.losses} (${(COUNTER.losses / COUNTER.total * 100).toFixed(2)} %)\n` +
		`Total:		${COUNTER.total}\n` +
		`Time:		${(duration / 1000).toFixed(2)} s`);*/
});

ELEMENTS.button_newgame.addEventListener("click", (event) => {
	GAME.state = Array(10).join(" ");
	GAME.turn = GAME.turn == PLAYER.user ? PLAYER.computer : PLAYER.user;

	if (GAME.turn == PLAYER.computer) {
		move_computer();
	}

	ELEMENTS.winner_notice.hidden = true;

	paint();
})

ELEMENTS.canvas.addEventListener("click", (event) => {
	let x = event.pageX - ELEMENTS.canvas.offsetLeft,
		y = event.pageY - ELEMENTS.canvas.offsetTop;

	let pos_i = Math.floor(y / 100) * 3 + Math.floor(x / 100);
	console.log(`Click:\nX:\t\t${x}\nY:\t\t${y}\nPos:\t${pos_i}`);

	if (!ELEMENTS.winner_notice.hidden) {
		console.error("Error: Game is finished")
	} else if (GAME.state[pos_i] == " ") {
		GAME.state = GAME.state.replaceAt(pos_i, PLAYER.user);

		let result = get_result();
		if (result == RESULT.running) {
			move_computer();
			result = get_result();
		}

		if (result == RESULT.computer) {
			ELEMENTS.winner_notice.innerHTML = "Computer won!";
			ELEMENTS.winner_notice.hidden = false;
		} else if (result == RESULT.user) {
			ELEMENTS.winner_notice.innerHTML = "You won!";
			ELEMENTS.winner_notice.hidden = false;
		} else if (result == RESULT.tie) {
			ELEMENTS.winner_notice.innerHTML = "Nobody won!";
			ELEMENTS.winner_notice.hidden = false;
		}

		paint();
	} else {
		console.error("Error: Illegal turn");
	}
});