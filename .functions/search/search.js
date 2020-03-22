/* eslint-disable */
const fetch = require('node-fetch');

const apiKey = process.env.CSE_KEY;
const cx = process.env.CSE_CX;

exports.handler = async function(event, context) {
  let query = event.queryStringParameters.query;
  if(!query) {
    return {
      statusCode: 500,
      body:'Must pass query parameter in the query string.'
    }
  }

  let start = event.queryStringParameters.start || 1;
  if(start <= 0 || start > 91) start = 1;

  let url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(query)}&start=${start}`;
  console.log(url); 
  let resp = await fetch(url);
  let data = await resp.json();
  //console.log(JSON.stringify(data.items, null, '\t'));
  // reduce the result a bit for simplification
  let result = {};
  result.info = data.searchInformation;
  result.info.totalResults = parseInt(result.info.totalResults, 10);
  result.items = data.items.map(d => {
    delete d.kind;
    if(d.pagemap && d.pagemap.cse_thumbnail) {
      d.thumbnail = { 
        src: d.pagemap.cse_thumbnail[0].src, 
        width: d.pagemap.cse_thumbnail[0].width, 
        height: d.pagemap.cse_thumbnail[0].height
      } 
    }
    delete d.pagemap;
    delete d.cacheId;
    return d
  });

  return {
    statusCode: 200,
    headers : {
      'Content-Type':'application/json'
    },
    body: JSON.stringify(result)
  }

  /*


  try {
    const response = await fetch('https://icanhazdadjoke.com', {
      headers: { Accept: 'application/json' }
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }

  }
  */

}
