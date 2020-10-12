const SG_KEY = process.env.SENDGRID;

const helper = require('sendgrid').mail;
const sg = require('sendgrid')(SG_KEY);

exports.handler = async event => {

  const form = JSON.parse(event.body).payload;
  console.log(`Recieved a submission: ${JSON.stringify(form)}`);


  let from_email = new helper.Email('raymondcamden@gmail.com');
	let to_email = new helper.Email('raymondcamden@gmail.com');
	let subject = 'Form Submission';

  let content = `Form:
${JSON.stringify(form,null, '\t')}`;

  let mailContent = new helper.Content('text/plain', content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

  sg.API(request, function(error, response) {
		if(error) {
			console.log(error.response.body);
		} else {
      console.log('it worked',JSON.stringify(response));
      return {
        statusCode: 200,
        headers : {
          'Content-Type':'application/json'
        },
        body: { success: true } 
      }

    }
	});


}
