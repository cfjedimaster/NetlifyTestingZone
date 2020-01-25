function getProducts() {
	/*
	 I would get access to the products from the static site data, 
	 going to fake it for now:
	*/
	return 'cats, dogs, and lizards';
}

exports.handler = function(event, context, callback) {
	/*
	Alexa info is in event.body. It's a JSON packet contaning a lot of
	information with the primary thing we want being intent
	*/
	let intent = '';
	if(event.body.request && event.body.intent) intent = event.body.intent.name;
	console.log(`intent=${intent}`);

	let text = '';

	if(!intent) {
		text = 'Hello World';
	} else if(intent = 'GetProducts') {
		text = 'Our products are ' + getProducts();
	}

 
	let response = {
		"version": "1.0",
		"response" :{
			"shouldEndSession": true,
			"outputSpeech": {
				"type": "PlainText",
				"text": text
				}
		}
	};

	callback(null, {
		statusCode:200,
		response
	});
	
}
