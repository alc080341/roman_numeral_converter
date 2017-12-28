

var origBoard;
const winCombos = [
	[0,1,2],
	[3,4,5],
	[6,7,8],
	[0,3,6],
	[1,4,7],
	[2,5,8],
	[0,4,8],
	[6,4,2]
];

var huPlayer;
var aiPlayer;
const cells = document.getElementsByClassName("tic");


function preLoad()
{
	document.getElementById("turnx").addEventListener("click", whichChar, false);
	document.getElementById("turno").addEventListener("click", whichChar, false);

}

function whichChar(noughtOrCrosses)
{
	if(noughtOrCrosses.target.id === "turnx")
	{
		huPlayer = "X";
		aiPlayer = "O";
		initialise();
	}
	else if(noughtOrCrosses.target.id === "turno")
	{
		huPlayer = "O";
		aiPlayer = "X";
		initialise();
	}

}


function initialise()
{

	//Creates an array of one to nine 
	origBoard = Array.from(Array(9).keys());
	document.getElementById("info_area").innerHTML = "<p>Select O or X to play</p>";

	for (var i = 0; i<cells.length; i++)
	{
		cells[i].innerHTML = '';
		cells[i].style.color = "white";	
		cells[i].addEventListener("click", turnClick, false);
	}
}





function turnClick(square)
{
	if(typeof origBoard[square.target.id] === 'number')
	{
		turn(square.target.id, huPlayer);
		if(!checkTie()) 
		{
			turn(bestSpot(), aiPlayer);
		}
	}
	
}






function turn(squareId, player)
{
	origBoard[squareId] = player;
	document.getElementById(squareId).innerHTML = player;
	let gameWon = checkWin(origBoard, player);
	if (gameWon)
	{
		gameOver(gameWon);
	}
}





function checkWin(board, player) 
{
	// a is accumulator, e is current value and i is index - this reduces the origBoard array to the values that the player has clicked
	let plays = board.reduce((a,e,i) => (e === player) ? a.concat(i) : a, []);
	let gameWon = null;

	// Checks through all of the winCombos index and win being positions in multi-dimensional array
	for (let [index, win] of winCombos.entries())
	{
		// Has the player got a spot in all the elements of winCombos
		if (win.every(elem => plays.indexOf(elem) > -1))
		{
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}




function gameOver(gameWon) 
{

	for(let index of winCombos[gameWon.index]) 
	{
		document.getElementById(index).style.color = (gameWon.player === huPlayer) ? "blue" : "red";
	}

	for(var j=0; j<cells.length; j++)
	{
		cells[j].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player === huPlayer ? "You win" : "Computer wins");
	document.getElementById("info_area").innerHTML = "<p>Select O or X to play</p>";

}

function declareWinner(who)
{
	//document.querySelector(".endgame").style.display = "block";
	document.getElementById("info_area").innerHTML = "<p>" + who + "</p>";
	alert(who + "");
}

function emptySquares()
{
	return origBoard.filter(s => typeof s === 'number');
}

function bestSpot()
{
	return minimax(origBoard,aiPlayer).index;
}

function checkTie()
{
	if(emptySquares().length === 0)
	{
		for(var r = 0; r< cells.length; r++)
		{
			cells[r].style.color = "green";
			cells[r].removeEventListener('click', turnClick, false);
		}
			declareWinner("Tie game!");
			document.getElementById("info_area").innerHTML = "<p>Select O or X to play</p>";

			return true;
	}
	return false;
}

function minimax(newBoard, player)
{
	var availSpots = emptySquares(newBoard);

	if(checkWin(newBoard, huPlayer))
	{
		return {score: -10};
	}
	else if (checkWin(newBoard, aiPlayer))
	{
		return {score: 10};
	}
	else if (availSpots.length === 0)
	{
		return {score: 0};
	}
	var moves = [];
	for (var s = 0; s < availSpots.length; s++)
	{
		var move = [];
		move.index = newBoard[availSpots[s]];
		newBoard[availSpots[s]] = player;
		if (player == aiPlayer)
		{
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		}
		else 
		{
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[s]] = move.index;
		moves.push(move);
	}

	var bestMove;
	if (player === aiPlayer)
	{
		var bestScore = -10000;
		for (var t=0; t<moves.length; t++)
		{
			if(moves[t].score > bestScore)
			{
				bestScore = moves[t].score;
				bestMove = t;
			}
		}
	}


	else 
	{
		var bestScore = 10000;
		for (var u=0; u<moves.length; u++)
		{
			if(moves[u].score < bestScore)
			{
				bestScore = moves[u].score;
				bestMove = u;
			}
		}

	}
	return moves[bestMove];
}