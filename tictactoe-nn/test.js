let model
let turn = ''
let board = [-1, -1, -1, -1, -1, -1, -1, -1, -1]

function setup () {
  createCanvas(600, 600)

  let options = {
		inputs: 9,
		outputs: ['label'],
		debug: true,
		task: 'classification',
		learningRate: 0.5,
		layers: [
      {
        type: 'dense',
        units: 16,
        activation: 'relu'
      },
      {
        type: 'dense',
        units: 16,
        activation: 'sigmoid'
      },
      {
        type: 'dense',
        activation: 'sigmoid'
      }
    ]
	}
  model = ml5.neuralNetwork(options)
  model.load('./model.json', modelLoaded)
}

function modelLoaded () {
  console.log(model)
  background(0)
  stroke(255)
  strokeWeight(5)
  line(width / 3, 0, width / 3, height)
  line(width / 3 * 2, 0, width / 3 * 2, height)
  line(0, height / 3, width, height / 3)
  line(0, height / 3 * 2, width, height / 3 * 2)
  aiTakeTurn()
}

function mousePressed () {
  if (turn === 'O') {
    let col, row
    if (mouseX < width / 3) {
      col = 0
    } else if (mouseX < width / 3 * 2) {
      col = 1
    } else {
      col = 2
    }
    if (mouseY < height / 3) {
      row = 0
    } else if (mouseY < height / 3 * 2) {
      row = 1
    } else {
      row = 2
    }

    let index = row * 3 + col
    console.log(index)
    if (board[index] === -1) {
      board[index] = 1
    }
    turn = 'X'
  }
}

function aiTakeTurn () {
  const toClassify = []
  for (let i = 0; i < board.length; i++) {
    if (board[i] === -1) {
      const tempBoard = board.slice()
      tempBoard[i] = 0
      toClassify.push(tempBoard)
    }
  }
  model.classifyMultiple(toClassify, (error, results) => {
    // got results
    console.log(results)
    let currentBestIndex = 0
    let currentBestConf = 0
    // let winWasGreater = false

    for (let i = 0; i < results.length; i++) {
      if (results[i][0].label === 'win') {
        // if (results[i][0].confidence > currentBestConf) {
        //   currentBestIndex = i
        //   currentBestConf = results[i][0].confidence
        //   winWasGreater = true
        // }
        if (results[i][0].confidence / results[i][1].confidence > currentBestConf) {
          currentBestIndex = i
          currentBestConf = results[i][0].confidence / results[i][1].confidence
        }
      } else {
        // if (results[i][1].confidence > currentBestConf) {
        //   if (!winWasGreater) {
        //     currentBestIndex = i
        //     currentBestConf = results[i][1].confidence
        //   }
        // }
        if (results[i][1].confidence / results[i][0].confidence > currentBestConf) {
          currentBestIndex = i
          currentBestConf = results[i][1].confidence / results[i][0].confidence
        }
      }
    }

    board = toClassify[currentBestIndex]
  })

  turn = 'O'
}

function draw () {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      let index = row * 3 + col
      if (board[index] === 1) {
        noStroke()
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(92)
        text('O', (width / 3 * col) + (width / 6), (height / 3 * row) + (height / 6))
      }
      if (board[index] === 0) {
        noStroke()
        fill(255)
        textAlign(CENTER, CENTER)
        textSize(92)
        text('X', (width / 3 * col) + (width / 6), (height / 3 * row) + (height / 6))
      }
    }
  }
  if (turn === 'X') {
    aiTakeTurn()
  }
}