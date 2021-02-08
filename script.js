const newGame = (width, height) => {
	$("#board").html(`Generating game...`);
	//Constants...
	const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
	const xv = alphabet;
	const yv = alphabet;
	//Stopwatch function...
	let startTime;
	let updatedTime;
	let difference;
	let tInterval;
	function startTimer() {
		startTime = new Date().getTime();
		tInterval = setInterval(updateShowTime, 1);
	}
	function stopTimer() {
		clearInterval(tInterval);
	}
	function updateShowTime() {
		updatedTime = new Date().getTime();
		difference = updatedTime - startTime;
		let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
		let seconds = Math.floor((difference % (1000 * 60)) / 1000);
		let milliseconds = Math.floor((difference % (1000 * 60)) / 100);hours = (hours < 10) ? "0" + hours : hours;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		seconds = (seconds < 10) ? "0" + seconds : seconds;
		milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;
		$("#timer").text(hours + ':' + minutes + ':' + seconds + ':' + milliseconds);
	}
	//Get mines function...
	function genMines(arr, p = 15) {
		let n = Math.ceil(arr.length * (p / 100))
		if (n <= 0) { n = 1 }
		if (n >= arr.length) { n = arr.length - 1 }
		var result = new Array(n),
			len = arr.length,
			taken = new Array(len);
		if (n > len)
			throw new RangeError("genMines: more elements taken than available");
		while (n--) {
			var x = Math.floor(Math.random() * len);
			result[n] = arr[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
		}
		return result;
	}
	function genBoardCoords(xv = alphabet, yv = alphabet, w = 8, h = 8) {
		let board = [];
		//Loops over every Y value
		for (let y = 0; y < w && y < yv.length; y++) {
			//Adds a new array for every Y value
			board.push([]);
			//loops over every X value
			for (let x = 0; x < h && x < xv.length; x++) {
				//Adds the coordinates onto the y's array
				board[y].push(`${xv[x]}${yv[y]}`)
			}
		}
		return board;
	}
	function genBoardVisual(b, bspobj, xv = alphabet, yv = alphabet) {
		bspobj.flagged.filter((v) => bspobj.discovered.includes(v)).forEach((v, i) => {
			bspobj.flagged.splice(i, 1);
		});
		$("#flags").text(`${bspobj.flagged.length}/${bspobj.mines.length}`);
		const tileType = "div"
		const tiles = {
			bomb: 'class="tile tile-bomb"',
			mark: 'class="tile tile-flag"',
			wrongmark: 'class="tile tile-flag-wrong"',
			undiscovered: 'class="tile tile-covered"',
			empty: 'class="tile tile-empty"',
			numbers: {
				num1: 'class="tile tile-number tile-one"',
				num2: 'class="tile tile-number tile-two"',
				num3: 'class="tile tile-number tile-three"',
				num4: 'class="tile tile-number tile-four"',
				num5: 'class="tile tile-number tile-five"',
				num6: 'class="tile tile-number tile-six"',
				num7: 'class="tile tile-number tile-seven"',
				num8: 'class="tile tile-number tile-eight"'
			}
		}
		//Generate board with tiles...
		var board = [];
		//Assumes 1st level arrays are rows...
		b.forEach((row, y) => {
			let rowSpan = [];
			//Loops over every column to add board...
			row.forEach((value, x) => {
				//Checks values to add correct emoji...
				if (bspobj.flagged.includes(value)) {
					if (bspobj.gameEnd && !bspobj.mines.includes(value)) {
						rowSpan.push(`<${tileType} ${tiles.wrongmark} id="${y},${x}"><h1 class="tile-label">🚩</h1></${tileType}>`);
					} else {
						rowSpan.push(`<${tileType} ${tiles.mark} id="${y},${x}"><h1 class="tile-label">🚩</h1></${tileType}>`);
					}
				} else if (bspobj.gameEnd && bspobj.mines.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.bomb} id="${y},${x}"><h1 class="tile-label">💣</h1></${tileType}>`);
				} else if (!bspobj.gameEnd && !bspobj.discovered.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.undiscovered} id="${y},${x}"><h1 class="tile-label"> </h1></${tileType}>`);
				} else if (bspobj.eight.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num8} id="${y},${x}"><h1 class="tile-label">8</h1></${tileType}>`);
				} else if (bspobj.seven.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num7} id="${y},${x}"><h1 class="tile-label">7</h1></${tileType}>`);
				} else if (bspobj.six.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num6} id="${y},${x}"><h1 class="tile-label">6</h1></${tileType}>`);
				} else if (bspobj.five.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num5} id="${y},${x}"><h1 class="tile-label">5</h1></${tileType}>`);
				} else if (bspobj.four.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num4} id="${y},${x}"><h1 class="tile-label">4</h1></${tileType}>`);
				} else if (bspobj.three.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num3} id="${y},${x}"><h1 class="tile-label">3</h1></${tileType}>`);
				} else if (bspobj.two.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num2} id="${y},${x}"><h1 class="tile-label">2</h1></${tileType}>`);
				} else if (bspobj.one.includes(value)) {
					rowSpan.push(`<${tileType} ${tiles.numbers.num1} id="${y},${x}"><h1 class="tile-label">1</h1></${tileType}>`);
				} else {
					rowSpan.push(`<${tileType} ${tiles.empty} id="${y},${x}"><h1 class="tile-label"> </h1></${tileType}>`);
				}
			});
			board.push(`<span class="board-row" id="row${y}">${rowSpan.join("")}</span>`);
		});
		return board;
	};
	//Win or loss function...
	function checkWinLoss() {
		if (board.discovered.some(v => board.mines.includes(v))) {
			board.gameEnd = true;
			console.log("You lost.");
			stopTimer();
			$("#messages").html(`<span>You hit a mine.</span>`);
			return false;
		} else if (board.flagged.every((v) => board.mines.includes(v)) && board.flagged.length == board.mines.length) {
			board.gameEnd = true;
			console.log("You won!");
			stopTimer();
			$("#messages").html(`<span>You won!</span>`);
			return true;
		};
	};
	//Board arrays...
	let coords = genBoardCoords(alphabet, alphabet, width, height);
	let board = {
		discovered: [],
		mines: genMines(coords.flat()),
		one: [],
		two: [],
		three: [],
		four: [],
		five: [],
		six: [],
		seven: [],
		eight: [],
		empty: [],
		flagged: [],
		gameEnd: false
	};
	//Checks the 8 tiles around every tile for bombs...
	coords.forEach((row, y) => {
		row.forEach((value, x) => {
			if (!board.mines.includes(value)) {
				let minenum = 0;
				let aboverow = coords[y + 1];
				let belowrow = coords[y - 1];
				if (board.mines.includes(row[x - 1])) minenum++;
				if (board.mines.includes(row[x + 1])) minenum++;
				if (aboverow) {
					if (board.mines.includes(aboverow[x])) minenum++;
					if (board.mines.includes(aboverow[x + 1])) minenum++;
					if (board.mines.includes(aboverow[x - 1])) minenum++;
				}
				if (belowrow) {
					if (board.mines.includes(belowrow[x])) minenum++;
					if (board.mines.includes(belowrow[x + 1])) minenum++;
					if (board.mines.includes(belowrow[x - 1])) minenum++;
				}
				if (minenum <= 0) board.empty.push(value);
				if (minenum == 8) board.eight.push(value);
				if (minenum == 7) board.seven.push(value);
				if (minenum == 6) board.six.push(value);
				if (minenum == 5) board.five.push(value);
				if (minenum == 4) board.four.push(value);
				if (minenum == 3) board.three.push(value);
				if (minenum == 2) board.two.push(value);
				if (minenum == 1) board.one.push(value);
			} else {
				return;
			}
		});
	});
	$("#board").html(genBoardVisual(coords, board));
	startTimer();
	$("#board").prepend("<!-- Auto Generated -->");
	$(document).on("click.minesweeper", ".tile-covered", (event) => {
		if (board.gameEnd) return;
		const targetCoords = event.currentTarget.id.split(',');
		const value = coords[targetCoords[0]][targetCoords[1]];
		if (board.empty.includes(value)) {
			board.discovered.push(value);
			//embed.addField('Flags', `${board.flagged.length}/${board.mines.length}`)
			do {
				board.empty.forEach((v, i) => {
					if (!board.discovered.includes(v)) return;
						var y = -1
						for (var rowt of coords) {
							y++
							if (rowt.includes(v)) {
								var x = rowt.indexOf(v)
								var row = rowt
								break
							}
						}
						let aboverow = coords[y + 1];
						let belowrow = coords[y - 1];
						//console.log(x)
						if (!board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
						if (!board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
						if (aboverow) {
							if (!board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
							if (!board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
							if (!board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
						}
						if (belowrow) {
							if (!board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
							if (!board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
							if (!board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
						}
					});
			} while (board.empty.some((v) => {
				//Do the same as the do statement except this time you're returning a value so that you can go do the do statement.
				if (!board.discovered.includes(v)) return false;
				var y = -1
				for (var rowt of coords) {
					y++
					if (rowt.includes(v)) {
						var x = rowt.indexOf(v)
						var row = rowt
						break
					}
				}
				let aboverow = coords[y + 1];
				let belowrow = coords[y - 1];
				//console.log(x)
				if (!board.discovered.includes(row[x - 1])) return true;
				if (!board.discovered.includes(row[x + 1])) return true;
				if (aboverow) {
					if (!board.discovered.includes(aboverow[x])) return true;
					if (!board.discovered.includes(aboverow[x + 1])) return true;
					if (!board.discovered.includes(aboverow[x - 1])) return true;
				}
				if (belowrow) {
					if (!board.discovered.includes(belowrow[x])) return true;
					if (!board.discovered.includes(belowrow[x + 1])) return true;
					if (!board.discovered.includes(belowrow[x - 1])) return true;
				}
				return false;
			}));
		} else {
			board.discovered.push(value);
		};
		checkWinLoss();
		$("#board").html(genBoardVisual(coords, board));
	});
	$(document).on("contextmenu.minesweeper", ".tile", (event) => {
		event.preventDefault();
		if (board.gameEnd) return;

		const targetCoords = event.currentTarget.id.split(',');
		const value = coords[targetCoords[0]][targetCoords[1]];
		if (board.discovered.includes(value)) return;
		if (board.flagged.includes(value)) {
			board.flagged.splice(board.flagged.indexOf(value), 1)
			$("#board").html(genBoardVisual(coords, board));
		} else {
			if (board.flagged.length >= board.mines.length) return;
			board.flagged.push(value);
			$("#board").html(genBoardVisual(coords, board));
		}
		checkWinLoss();
	});
	$(document).on("click.minesweeper", ".tile-number", (event) => {
		const targetCoords = event.currentTarget.id.split(',');
		const value = coords[targetCoords[0]][targetCoords[1]];
		//Like the left+right click in real game...
		var y = -1;
		for (var rowt of coords) {
			y++;
			if (rowt.includes(value)) {
				var x = rowt.indexOf(value);
				var row = rowt;
				break;
			}
		}
		let aboverow = coords[y + 1];
		let belowrow = coords[y - 1];
		if (!board.flagged.includes(row[x - 1]) && !board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
		if (!board.flagged.includes(row[x + 1]) && !board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
		if (aboverow) {
			if (!board.flagged.includes(aboverow[x]) && !board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
			if (!board.flagged.includes(aboverow[x + 1]) && !board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
			if (!board.flagged.includes(aboverow[x - 1]) && !board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
		}
		if (belowrow) {
			if (!board.flagged.includes(belowrow[x]) && !board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
			if (!board.flagged.includes(belowrow[x + 1]) && !board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
			if (!board.flagged.includes(belowrow[x - 1]) && !board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
		}
		do {
			board.empty.forEach((v, i) => {
				if (!board.discovered.includes(v)) return;
				var y = -1;
				for (var rowt of coords) {
					y++;
					if (rowt.includes(v)) {
						var x = rowt.indexOf(v);
						var row = rowt;
						break;
					}
				}
				let aboverow = coords[y + 1];
				let belowrow = coords[y - 1];
				if (!board.discovered.includes(row[x - 1])) board.discovered.push(row[x - 1]);
				if (!board.discovered.includes(row[x + 1])) board.discovered.push(row[x + 1]);
				if (aboverow) {
					if (!board.discovered.includes(aboverow[x])) board.discovered.push(aboverow[x]);
					if (!board.discovered.includes(aboverow[x + 1])) board.discovered.push(aboverow[x + 1]);
					if (!board.discovered.includes(aboverow[x - 1])) board.discovered.push(aboverow[x - 1]);
				}
				if (belowrow) {
					if (!board.discovered.includes(belowrow[x])) board.discovered.push(belowrow[x]);
					if (!board.discovered.includes(belowrow[x + 1])) board.discovered.push(belowrow[x + 1]);
					if (!board.discovered.includes(belowrow[x - 1])) board.discovered.push(belowrow[x - 1]);
				}
			})
		} while (board.empty.some((v) => {
			//Do the same as the do statement except this time you're returning a value so that you can go do the do statement.
			if (!board.discovered.includes(v)) return false;
			var y = -1;
			for (var rowt of coords) {
				y++;
				if (rowt.includes(v)) {
					var x = rowt.indexOf(v);
					var row = rowt;
					break;
				}
			}
			let aboverow = coords[y + 1];
			let belowrow = coords[y - 1];
			if (!board.discovered.includes(row[x - 1])) return true;
			if (!board.discovered.includes(row[x + 1])) return true;
			if (aboverow) {
				if (!board.discovered.includes(aboverow[x])) return true;
				if (!board.discovered.includes(aboverow[x + 1])) return true;
				if (!board.discovered.includes(aboverow[x - 1])) return true;
			}
			if (belowrow) {
				if (!board.discovered.includes(belowrow[x])) return true;
				if (!board.discovered.includes(belowrow[x + 1])) return true;
				if (!board.discovered.includes(belowrow[x - 1])) return true;
			}
			return false;
		}));
		checkWinLoss();
		$("#board").html(genBoardVisual(coords, board));
	});
	$(document).on("click.minesweeper", "#button-reset", () => {
		stopTimer();
	});
};

$("#board").on("contextmenu", (event) => event.preventDefault());
$(document).on("contextmenu", ".tile", (event) => event.preventDefault());

$(document).on("click", "#button-reset", () => {
	console.log("New Game!");
	$(document).off("click.minesweeper");
	$(document).off("contextmenu.minesweeper");
	const selected = $("#select-size option:selected").val();
	if (selected === "custom") {
		console.log("Custom Options");
		alert("This option doesn't work yet.");
	} else {
		const size = selected.split("x");
		newGame(size[0], size[1]);
	}
	$("#messages").empty();
});

$("#button-reset").click();

