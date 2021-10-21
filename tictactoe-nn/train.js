let model
let testBoard = []

function setup () {
	createCanvas(400, 400)

	let options = {
		inputs: 9,
		outputs: ['label'],
		debug: true,
		task: 'classification',
		learningRate: 0.3,
		layers: [
      {
        type: 'dense',
        units: 8,
        activation: 'tanh'
      },
      {
        type: 'dense',
        activation: 'sigmoid'
      }
    ]
	}
	model = ml5.neuralNetwork(options)
	generateTrainingData(958)
}

function keyPressed () {
	if (key === 't') {
		trainModel()
	}
}

function trainModel () {
	model.normalizeData()
	let options = {
		epochs: 3580
	}
	console.log(model.neuralNetwork.data)
	model.train(options, whileTraining, doneTraining)
}

function whileTraining (epoch, loss) {
	console.log(epoch)
}

function doneTraining () {
	console.log('Training complete')
}

function generateTrainingData (amount) {
	let winGames = 0
	let loseGames = 0
	for (let i = 0; i < amount; i++) {
		// play a random game
		let moves = []
		let turn = 'X'
		let finished = false
		let result = null
		let board = ['', '', '', '', '', '', '', '', '']
		while (!finished) {
			// check win states
			for (let row = 0; row < 3; row++) {
				let index = row * 3
				if (board[index] === 'X' && board[index + 1] === 'X' && board[index + 2] === 'X')	{
					finished = true
					result = 1
				}
				if (board[index] === 'O' && board[index + 1] === 'O' && board[index + 2] === 'O')	{
					finished = true
					result = -1
				}
			}
			for (let col = 0; col < 3; col++) {
				if (board[col] === 'X' && board[col + 3] === 'X' && board[col + 6] === 'X')	{
					finished = true
					result = 1
				}
				if (board[col] === 'O' && board[col + 3] === 'O' && board[col + 6] === 'O')	{
					finished = true
					result = -1
				}
			}
			if (board[0] === 'X' && board[4] === 'X' && board[8] === 'X')	{
				finished = true
				result = 1
			}
			if (board[0] === 'O' && board[4] === 'O' && board[8] === 'O')	{
				finished = true
				result = -1
			}
			if (board[2] === 'X' && board[4] === 'X' && board[6] === 'X')	{
				finished = true
				result = 1
			}
			if (board[2] === 'O' && board[4] === 'O' && board[6] === 'O')	{
				finished = true
				result = -1
			}

			let draw = true
			board.forEach(cell => {
				if (cell === '') {
					draw = false
				}
			})

			if (draw) {
				finished = true
				result = -1
			}

			if (!finished) {
				let foundOpen = false
				let index = null
				while (!foundOpen) {
					index = Math.floor(Math.random() * 9)
					if (board[index] === '') {
						foundOpen = true
					}
				}
				board[index] = turn
				if (turn === 'X') {
					turn = 'O'
					moves.push(board.slice())
				} else {
					turn = 'X'
				}
			}
		}
		// console.log(moves, result)
		moves.forEach(move => {
			let moveNumerical = move.map(cell => {
				if (cell === 'X') {
					return 0
				} else if (cell === 'O') {
					return 1
				} else {
					return -1
				}
			})
			if (result === -1) {
				loseGames += 1
				model.addData(moveNumerical, { label: 'lose' })
			} else if (result === 1) {
				winGames += 1
				model.addData(moveNumerical, { label: 'win' })
			}
		})
	}
	console.log('Training data created')
	// console.log(model.neuralNetworkData.data.raw)
	console.log('Win games:', winGames)
	console.log('Lose games:', loseGames)
}

function drawCurrentBoard () {

}

function draw () {

}