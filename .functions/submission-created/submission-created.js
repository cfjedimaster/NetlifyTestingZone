
exports.handler = async (event, context) => {

  let payload = JSON.parse(event.body).payload;
	let name = new helper.Email(payload.data.name);
	let email = new helper.Email(payload.data.email);
	let comments = new helper.Email(payload.data.comments);

  console.log(`name, ${name}, email, ${email}, comments, ${comments}`);
  
}
