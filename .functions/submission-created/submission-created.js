
exports.handler = async (event, context) => {

  let payload = JSON.parse(event.body).payload;
	let name = payload.data.name;
	let email = payload.data.email;
	let comments = payload.data.comments;

  console.log(`name, ${name}, email, ${email}, comments, ${comments}`);

}
