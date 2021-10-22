let model
let testBoard = []

function setup () {
	createCanvas(400, 400)

	let options = {
		inputs: 9,
		outputs: ['label'],
		debug: true,
		task: 'classification',
		learningRate: 0.1,
		adaptiveLearningRate: true,
		adaptiveLearningRateDecay: 0.0001,
		layers: [
      {
        type: 'dense',
        units: 32,
        activation: 'relu'
      },
      {
        type: 'dense',
        units: 8,
        activation: 'relu'
      },
      {
        type: 'dense',
        activation: 'softmax'
      }
    ]
	}
	model = ml5.neuralNetwork(options)
	generateTrainingData(2500)
}

function keyPressed () {
	if (key === 't') {
		trainModel()
	}
}

function trainModel () {
	model.normalizeData()
	model.createMetaData(model.neuralNetworkData.data.raw)
	model.prepareForTraining(model.neuralNetworkData.data.raw)
	model.options.layers = model.createNetworkLayers(
		model.options.layers,
		model.neuralNetworkData.meta
	)
	model.compile(_modelOptions = {
		loss: 'binaryCrossentropy',
		metrics: ['accuracy'],
	})
	console.log(model.data.training)
	let options = {
		epochs: 4000,
		batchSize: model.neuralNetworkData.data.raw.length
	}
	model.train(options, doneTraining)
}

function doneTraining () {
	console.log('Training complete')
}

function generateTrainingData (amount) {
	let winGames = 0
	let loseGames = 0
	let allMoves = []
	for (let i = 0; i < amount; i++) {
		// play a random game
		let moves = []
		let turn = Math.random() < 0.5 ? 'X' : 'O'
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
			const alreadySaved = allMoves.find((savedMove) => {
				let same = true
				for (let i = 0; i < savedMove.board.length; i++) {
					if (savedMove.board[i].toString() !== moveNumerical[i].toString()) {
						same = false
					}
				}
				return same
			})
			if (!alreadySaved) {
				if (result === -1) {
					// if (loseGames <= winGames) {
					// 	loseGames += 1
					// 	model.addData(moveNumerical, { label: 'lose' })
					// }
					allMoves.push({ board: moveNumerical, label: 'lose' })
				} else if (result === 1) {
					// if (winGames <= loseGames) {
					// 	winGames += 1
					// 	model.addData(moveNumerical, { label: 'win' })
					// }
					allMoves.push({ board: moveNumerical, label: 'win' })
				}
			} else {
				console.log('already saved')
			}
		})
	}
	allMoves.forEach(move => {
		model.addData(move.board, { label: move.label })
	})
	console.log('Training data created')
	console.log('Win games:', winGames)
	console.log('Lose games:', loseGames)
}

function drawCurrentBoard () {

}

function draw () {

}