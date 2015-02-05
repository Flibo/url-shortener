var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({
	extended: true
}));

// This URL shortener simply assigns links to base 62
// IDs using the letters a-z both lower and upper case
// as well as numbers 0-9. It stores the links in memory.

var counter = 0; // number of links
var links = []; // collection of links

var conversionMapping = ['a', 'b', 'c', 'd', 'e', 'f', 'g',
						 'h', 'i', 'j', 'k', 'l', 'm', 'n',
						 'o', 'p', 'q', 'r', 's', 't', 'u',
						 'v', 'w', 'x', 'y', 'z',
						 'A', 'B', 'C', 'D', 'E', 'F', 'G',
						 'H', 'I', 'J', 'K', 'L', 'M', 'N',
						 'O', 'P', 'Q', 'R', 'S', 'T', 'U',
						 'V', 'W', 'X', 'Y', 'Z',
						 '0', '1', '2', '3', '4', '5', '6',
						 '7', '8', '9'];

// This function takes an integer as a parameter and returns a string
function toBase62(number) {
	var digits = [];

	if (number == 0) {return 'a';} // special case
	while (number > 0) {
		digits.unshift(conversionMapping[number % 62]);
		number = Math.floor(number / 62);
	}

	var result = digits.join('');
	return result;
}

// This function takes a string as a paremeter and returns an integer
function toBase10(string) {
	var result = 0;

	for (var i = 0; i < string.length; i++) {
		var index = conversionMapping.indexOf(string[i]);
		result += index * Math.pow(62, string.length - 1 - i);
	}

	return result;
}

// To prevent users from misusing the service
function validateUrl(url) {
	var urlregex = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/;
	return urlregex.test(url);
}

// Fetch the correct link from memory and redirect to it
app.get('/:short', function(request, response) {
	var index = toBase10(request.params.short);
	if (index < links.length) {
		response.status(301).redirect(links[index]);
	}
	else {
		response.status(404).send("Sorry! You tried to use an invalid link ID.");
	}
});

// Add a new link to memory and return the short url
app.post('/shorten', function(request, response) {
	var link = request.body.link;

	if (validateUrl(link)) {
		links.push(link);
		response.send(toBase62(counter));
		counter++;
	}
	else {
		response.send("Sorry! You tried to shorten an invalid URL.");
	}
});

app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'));
});
