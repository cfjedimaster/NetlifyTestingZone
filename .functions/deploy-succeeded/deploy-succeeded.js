// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {

    console.log('deploy succeeded run!');
    let pubData = JSON.parse(event.body).payload;

    // get the time
    let buildTime = pubData.published_at;
    //in seconds;
    let buildDuration = pubData.deploy_time;

    console.log(`BUILT at ${buildTime} in ${buildDuration} seconds`);

    return {
      statusCode: 200,
      body: ''
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
