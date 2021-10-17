let classifier

let loadedImage

function modelReady () {
	console.log('model is ready')
	classifier.classify(loadedImage, (error, results) => {
		if (error) console.error(error)
		else {
			console.log(results)
			console.log(results[0].label, (results[0].confidence * 100).toFixed(2) + '%')
		}
	})
}

function imageReady () {
	image(loadedImage, 0, 0, width, height)
}

function setup () {
	createCanvas(400, 400)
	background(0)

	loadedImage = createImg('images/maltichon.jpg', imageReady)
	loadedImage.hide()

	classifier = ml5.imageClassifier('MobileNet', modelReady)
}

function draw () {

}