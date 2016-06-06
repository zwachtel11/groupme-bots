var HTTPS = require('https');
var cool = require('cool-ascii-faces');

var botID = process.env.BOT_ID;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/gay guy$/;

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else {
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function heyheyhey() {
	var http = require('http');

		//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
		host: 'www.espn.go.com',
		path: '/nba/bottomline/scores'
};

	callback = function(response) {
			var str = '';

  //another chunk of data has been recieved, so append it to `str`
	response.on('data', function (chunk) {
		str += chunk;
		});

  //the whole response has been recieved, so we just print it out here
	response.on('end', function () {
		return str;
	});
}

http.request(options, callback).end();




}



function postMessage() {
  var botResponse, options, body, botReq;

  botResponse = heyheyhey();
  var hey = botResponse.split("%20");
  

  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
  "text" : "The Land: " + hey[1] + "\n Dubs: " + hey[4]

  };

  console.log('sending ' + botResponse + ' to ' + botID);

  botReq = HTTPS.request(options, function(res) {
      if(res.statusCode == 202) {
        //neat
      } else {
        console.log('rejecting bad status code ' + res.statusCode);
      }
  });

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err));
  });
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err));
  });
  botReq.end(JSON.stringify(body));
}


exports.respond = respond;