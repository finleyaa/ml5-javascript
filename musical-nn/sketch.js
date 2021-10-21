let model
let targetLabel = 'C'
let trainingData = []

let classifying = false

let synth

function setup () {
	createCanvas(500, 500)

	getAudioContext().suspend()

	synth = new p5.MonoSynth()

	let options = {
		inputs: ['x', 'y'],
		outputs: ['label'],
		task: 'classification',
		debug: true,
		learningRate: 0.5
	}
	model = ml5.neuralNetwork(options)
	model.loadData('mouse-notes.json', dataLoaded)
	background(0)
}

function dataLoaded () {
	console.log(model)
	model.neuralNetworkData.data.raw.forEach((data) => {
		stroke(255)
		noFill()
		ellipse(data.xs.x, data.xs.y, 24)
		fill(255)
		noStroke()
		textAlign(CENTER, CENTER)
		text(data.ys.label, data.xs.x, data.xs.y)
	})
}

function keyPressed () {
	if (key === 't') {
		model.normalizeData()
		let options = {
			epochs: 100
		}
		model.train(options, whileTraining, finishedTraining)
		return
	} else if (key === 's') {
		model.saveData('mouse-notes')
	}

	targetLabel = key.toUpperCase()
}

function whileTraining (epoch, loss) {
	console.log(epoch)
}

function finishedTraining () {
	console.log('Training finished')
	classifying = true
	// drawDecisionField()
}

function drawDecisionField () {
	for (let x = 0; x < width; x += 10) {
		for (let y = 0; y < height; y += 10) {
			let inputs = {
				x,
				y
			}
			model.classify(inputs, (error, results) => {
				noStroke()
				if (results[0].label === 'C') {
					fill(100, 0, 200)
				} else if (results[0].label === 'D') {
					fill(200, 0, 100)
				} else if (results[0].label === 'E') {
					fill(100, 200, 0)
				}
				ellipse(x, y, 10)
			})
		}
	}
}

function mousePressed () {
	userStartAudio()
	
	let inputs = {
		x: mouseX,
		y: mouseY
	}

	if (classifying) {
		model.classify(inputs, (error, results) => {
			console.log(results[0].label, results[0].confidence)
			synth.play(results[0].label + '5')
		})
		return
	}

	let target = { label: targetLabel }

	model.addData(inputs, target)

	stroke(255)
	noFill()
	ellipse(mouseX, mouseY, 24)
	fill(255)
	noStroke()
	textAlign(CENTER, CENTER)
	text(targetLabel, mouseX, mouseY)

	synth.play(targetLabel + '5')
}

function mouseDragged () {
	mousePressed()
}