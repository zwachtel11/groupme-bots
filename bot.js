var HTTPS = require('https');
var HTTP = require('http');
var cool = require('cool-ascii-faces');
var request = require('request');

var botID = process.env.BOT_ID;
var apiKey = process.env.API_KEY;

function respond() {
  var request = JSON.parse(this.req.chunks[0]),
      botRegex = /^\/sports guy$/;
	  botRegex1 = /^\/weather$/;
    giphyCommand = '/giphy';

  if(request.text && botRegex.test(request.text)) {
    this.res.writeHead(200);
    postMessage();
    this.res.end();
  } else if (request.text && botRegex1.test(request.text)) {
	      this.res.writeHead(200);
	      postMessage1();
	      this.res.end();
	}else if (request.text &&
     request.text.length > giphyCommand.length &&
     request.text.substring(0, giphyCommand.length) === giphyCommand) {
    this.res.writeHead(200);
    searchGiphy(request.text.substring(giphyCommand.length + 1));
    this.res.end();
  }else{
    console.log("don't care");
    this.res.writeHead(200);
    this.res.end();
  }
}

function searchGiphy(giphyToSearch) {
  var options = {
    host: 'api.giphy.com',
    path: '/v1/gifs/search?q=' + encodeQuery(giphyToSearch) + '&api_key=' + apiKey
  };

  var callback = function(response) {
    var str = '';

    response.on('data', function(chunck){
      str += chunck;
    });

    response.on('end', function() {
      if (!(str && JSON.parse(str).data[0])) {
        postMessage2('Couldn\'t find a gif 💩');
      } else {
        var id = JSON.parse(str).data[0].id;
        var giphyURL = 'http://i.giphy.com/' + id + '.gif';
        postMessage2(giphyURL);
      }
    });
  };

  HTTP.request(options, callback).end();
}

function encodeQuery(query) {
  return query.replace(/\s/g, '+');;
}


function postMessage() {
  var botResponse, options, body, botReq, yoo;


  request('http://espn.go.com/mlb/bottomline/scores', function (error, response, body) {
      if (!error && response.statusCode == 200) {
          yoo = body.split("%20"); // Show the HTML for the Modulus homepage.


	botResponse = "Golden " + yoo[1]+ " " + yoo[5] + " " + yoo[6];
 // var hey = botResponse.split("%20");


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
  "text" : botResponse

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
});
}
function postMessage1() {
  var botResponse, options, body, botReq, yoo;


  request('http://api.openweathermap.org/data/2.5/weather?q=NewYork&appid=1060eaf4c622581951b7ed6e3784b6fa', function (error, response, body) {
      if (!error && response.statusCode == 200) {
  		var hey = JSON.parse(body);
  		var yo = parseFloat(hey.main.temp);
  		var temp = yo * (9/5) - 459.67;
		var descript = hey.weather[0].description;

		botResponse = "Temp: " + temp + " type: " + descript;
 // var hey = botResponse.split("%20");


  options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  };

  body = {
    "bot_id" : botID,
  "text" : botResponse

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
});

}
function postMessage2(message) {
var botResponse, options, body, botReq;

botResponse = message;

options = {
  hostname: 'api.groupme.com',
  path: '/v3/bots/post',
  method: 'POST'
};

body = {
  "bot_id" : botID,
  "text" : botResponse
};

console.log('sending ' + botResponse + ' to ' + botID);

botReq = HTTPS.request(options, function(res) {
    if(res.statusCode == 202) {
      console.log('202 response');
    } else {
      console.log('rejecting bad status code from groupme:' + res.statusCode);
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
