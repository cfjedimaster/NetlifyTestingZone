// Docs on event and context https://www.netlify.com/docs/functions/#the-handler-method
exports.handler = async (event, context) => {
  try {

    console.log('deploy succeeded run');
    console.log(JSON.stringify(event));

    // get the time
    let pubData = JSON.parse(event.body).payload;
    console.log(JSON.stringify(pubData));

    return {
      statusCode: 200,
      body: ''
    }
  } catch (err) {
    return { statusCode: 500, body: err.toString() }
  }
}
