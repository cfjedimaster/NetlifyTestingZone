const SDK = require('@ringcentral/sdk').SDK;

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
  try {

    console.log('deploy succeeded run!');
    let pubData = JSON.parse(event.body).payload;

    // get the time
    let buildTime = pubData.published_at;
    //in seconds;
    let buildDuration = pubData.deploy_time;

    console.log(`BUILT at ${buildTime} in ${buildDuration} seconds`);
    await sendSMS(buildTime, buildDuration);

    return {
      statusCode: 200,
      body: ''
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}

async function sendSMS(time,duration) {

  console.log('do login');
	await platform.login({
		username: RINGCENTRAL_USERNAME,
		password: RINGCENTRAL_PASSWORD,
		extension: RINGCENTRAL_EXTENSION
		});
	console.log('done logging in');
	let resp = await platform.post('/restapi/v1.0/account/~/extension/~/sms', {
		from: {'phoneNumber': RINGCENTRAL_USERNAME},
		to: [{'phoneNumber': RECIPIENT}],
		text: `Site built at ${time} and took ${duration} seconds.`
  });
	
	console.log('done with msg');
  let data = await resp.json();
  return data;

}
