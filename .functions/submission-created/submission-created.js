const SG_KEY = process.env.SENDGRID;

const helper = require('sendgrid').mail;
const sg = require('sendgrid')(SG_KEY);

exports.handler = async event => {

  const form = JSON.parse(event.body).payload;
  console.log(`Recieved a submission: ${JSON.stringify(form)}`);


  let from_email = new helper.Email('raymondcamden@gmail.com');
	let to_email = new helper.Email('raymondcamden@gmail.com');
	let subject = 'Form Submission';
  
  let date = new Date();
	let content = `
Form Submitted at ${date}
--------------------------------
`;

	for(let key in form.data) {
    let field = key + ':';
		content += `
${field.padEnd(30)}${form.data[key]}
`;
	}

content += `

${JSON.stringify(form)}
`;

  let mailContent = new helper.Content('text/plain', content);
	let mail = new helper.Mail(from_email, subject, to_email, mailContent);

	let request = sg.emptyRequest({
		method: 'POST',
		path: '/v3/mail/send',
		body: mail.toJSON()
	});

  try {
    let response = await sg.API(request);
    return {
      statusCode: 200, 
      body: { success: true }
    };
  } catch(e) {
    console.log('Error with SendGrid', e);
  }
  
}
