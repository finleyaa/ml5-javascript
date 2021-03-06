let img
let detector

function preload () {
	img = loadImage('images/dogs.jpeg')
	detector = ml5.objectDetector('cocossd') 
}

function setup () {
	createCanvas(img.width, img.height)
	image(img, 0, 0)
	textSize(16)
	strokeWeight(2)
	detector.detect(img, (error, results) => {
		if (error) console.error(error)
		console.log(results)
		for (let i = 0; i < results.length; i++) {
			noFill()
			stroke(0, 255, 100)
			rect(results[i].x, results[i].y, results[i].width, results[i].height)
			noStroke()
			fill(0, 255, 100)
			text(results[i].label, results[i].x + 10, results[i].y + 20)
		}
	})
}

function draw () {

}