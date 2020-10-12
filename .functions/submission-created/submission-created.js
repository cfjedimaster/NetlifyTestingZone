const SG_KEY = process.env.SENDGRID;

const helper = require('sendgrid').mail;
const sg = require('sendgrid')(SG_KEY);

exports.handler = async event => {

  const form = JSON.parse(event.body).payload;
  console.log(`Recieved a submission: ${JSON.stringify(form)}`);


  let from_email = new helper.Email('raymondcamden@gmail.com');
	let to_email = new helper.Email('raymondcamden@gmail.com');
	let subject = 'Form Submission';

console.log('um wtf 0');
  
  let content = `Form:
${JSON.stringify(form,null, '\t')}`;

  let mailContent = new helper.Content('text/plain', content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);

  console.log('um wtf');

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

  console.log('um wtf 3');

  /*
  sg.API(request, function(error, response) {
    console.log('did anything show up');
		if(error) {
			console.log(error.response.body);
		} else {
      console.log('it worked',JSON.stringify(response));
    }
	});
  */
  let response = await sg.API(request);
  console.log('it worked',JSON.stringify(response));
  
  console.log('end of func');
}
