const SDK = require('@ringcentral/sdk').SDK;

// used for sms
RECIPIENT = process.env.SMS_RECIP;
RINGCENTRAL_CLIENTID = process.env.RINGCENTRAL_CLIENTID;
RINGCENTRAL_CLIENTSECRET = process.env.RINGCENTRAL_CLIENTSECRET;
RINGCENTRAL_SERVER = process.env.RINGCENTRAL_SERVER;
RINGCENTRAL_USERNAME = process.env.RINGCENTRAL_USERNAME;
RINGCENTRAL_PASSWORD = process.env.RINGCENTRAL_PASSWORD;
RINGCENTRAL_EXTENSION = process.env.RINGCENTRAL_EXTENSION;

var rcsdk = new SDK({
  server: RINGCENTRAL_SERVER,
  clientId: RINGCENTRAL_CLIENTID,
  clientSecret: RINGCENTRAL_CLIENTSECRET
});
var platform = rcsdk.platform();

exports.handler = async (event, context) => {

  let payload = JSON.parse(event.body).payload;
  let name = payload.data.name;
  let email = payload.data.email;
  let comments = payload.data.comments;

  console.log(`name, ${name}, email, ${email}, comments, ${comments}`);

  // The text to synthesize
  const text = `A form was sent by ${name} (email address of ${email}), with these comments: ${comments}`;
  await sendSMS(text);

}

async function sendSMS(text) {

  await platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
  });

  let resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
    from: {'phoneNumber': RINGCENTRAL_USERNAME},
    to: [{'phoneNumber': RECIPIENT}],
    text: text
  });
	
  let data = await resp.json();
  return data;
}