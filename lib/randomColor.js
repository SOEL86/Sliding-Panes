function randomColor(){

	var colors= [	"w3-pink",
					"w3-purple",
					"w3-deep-purple",
					"w3-indigo",
					"w3-blue",
					"w3-cyan",
					"w3-aqua",
					"w3-teal",
					"w3-green",
					"w3-lime",
					"w3-yellow",
					"w3-amber",
					"w3-orange",
					"w3-deep-orange",
					"w3-blue-grey",
					"w3-brown",
					"w3-grey",
					"w3-dark-grey"
				];
	return colors[getRandomInt(0,colors.length-1)];
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}