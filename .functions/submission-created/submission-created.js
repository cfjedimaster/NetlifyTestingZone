const textToSpeech = require('@google-cloud/text-to-speech');
const SDK = require('@ringcentral/sdk').SDK;
const fs = require('fs');
const util = require('util');

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

// used for TTS
const client = new textToSpeech.TextToSpeechClient({
  credentials: {
    "type": "service_account",
    "project_id": process.env.project_id,
    "private_key_id": process.env.private_key_id,
    "private_key": process.env.private_key,
    "client_email": process.env.client_email,
    "client_id": process.env.client_id,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.client_x509_cert_url
  }
});

exports.handler = async (event, context) => {

  let payload = JSON.parse(event.body).payload;
  let name = payload.data.name;
  let email = payload.data.email;
  let comments = payload.data.comments;

  console.log(`name, ${name}, email, ${email}, comments, ${comments}`);

  // The text to synthesize
  const text = `A form was sent by ${name} (email address of ${email}), with these comments: ${comments}`;
  console.log('try to make mp3');
  let mp3File = await getSoundFile(text);
  console.log('got mp3');
  await sendSMS(mp3File, text);

}

async function getSoundFile(text) {
  // Construct the request
  const request = {
    input: { text: text },
    // Select the language and SSML voice gender (optional)
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
    // select the type of audio encoding
    audioConfig: { audioEncoding: 'MP3' },
  };

  // Performs the text-to-speech request
  const [response] = await client.synthesizeSpeech(request);
  // Write the binary audio content to a local file
  const writeFile = util.promisify(fs.writeFile);
  // filename should be dynamic
  await writeFile('output.mp3', response.audioContent, 'binary');
  return 'output.mp3';
}

async function sendSMS(filename, text) {

  await platform.login({
    username: RINGCENTRAL_USERNAME,
    password: RINGCENTRAL_PASSWORD,
    extension: RINGCENTRAL_EXTENSION
  });
  /*
let resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
  from: {'phoneNumber': RINGCENTRAL_USERNAME},
  to: [{'phoneNumber': RECIPIENT}],
  text: `Site built at ${time} and took ${duration} seconds.`
});
	
let data = await resp.json();
return data;
*/
  const body = {
    from: { phoneNumber: RINGCENTRAL_USERNAME },
    to: [{ phoneNumber: RECIPIENT }],
    text: text
  };
  const formData = new FormData()
  file = { filename: 'request.json', contentType: 'application/json' };
  formData.append('json',
    Buffer.from(JSON.stringify(body)),file);
  formData.append('attachment',
    require('fs').createReadStream(filename));

  let response = await platform.post('/account/~/extension/~/sms', formData);
  return await response.json();
    /*
  platform.post('/account/~/extension/~/sms', formData).then(response => {
    console.log('MMS sent: ' + response.json().id)
  }).catch(e => {
    console.error(e)
  })
  */
}