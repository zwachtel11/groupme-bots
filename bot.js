'use strict'

const HTTPS = require('https')
const HTTP = require('http')
const parseString = require('xml2js').parseString
const request = require('request')
const botID = process.env.BOT_ID
const apiKey = process.env.API_KEY

const postMessage = function(message) {

  const botResponse = message

  const options = {
    hostname: 'api.groupme.com',
    path: '/v3/bots/post',
    method: 'POST'
  }

  const body = {
    'bot_id': botID,
    'text': botResponse
  }

  console.log('sending ' + botResponse + ' to ' + botID)

  const botReq = HTTPS.request(options, function(res) {
    if (res.statusCode === 202) {
        console.log('202 response')
    }
    else {
      console.log('rejecting bad status code from groupme:' + res.statusCode)
    }
  })

  botReq.on('error', function(err) {
    console.log('error posting message '  + JSON.stringify(err))
  })
  botReq.on('timeout', function(err) {
    console.log('timeout posting message '  + JSON.stringify(err))
  })
  botReq.end(JSON.stringify(body))

}

const encodeQuery = function(query) {
  return query.replace(/\s/g, '+')
}

const searchGiphy = function(giphyToSearch) {
  const options = {
    host: 'api.giphy.com',
    path: '/v1/gifs/search?q=' + encodeQuery(giphyToSearch) + '&api_key=' + apiKey
  }

  const callback = function(response) {
    let str = ''

    response.on('data', function(chunck) {
      str += chunck
    })

    response.on('end', function() {
      if (!(str && JSON.parse(str).data[0])) {
        postMessage('Couldn\'t find a gif 💩')
      }
      else {
        const id = JSON.parse(str).data[0].id
        const giphyURL = 'http://i.giphy.com/' + id + '.gif'

        postMessage(giphyURL)
      }
    })
  }

  HTTP.request(options, callback).end()
}

const sportMessage = function() {
  let botResponse = ''

  request('http://espn.go.com/mlb/bottomline/scores', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const yoo = body.split('%20')

      botResponse = 'Golden ' + yoo[1] +  '' + yoo[5] + '' + yoo[6]
    }
    else {
      botResponse = 'Error: Max Licht is a Herb'
    }
    postMessage(botResponse)
  })
}

const weatherMessage = function() {

  request('http://api.openweathermap.org/data/2.5/weather?q=NewYork&appid=1060eaf4c622581951b7ed6e3784b6fa', function(error, response, body) {
    if (!error && response.statusCode === 200) {
      const hey = JSON.parse(body)
      const yo = parseFloat(hey.main.temp)
      const temp = yo * (9 / 5) - 459.67
      const descript = hey.weather[0].description

      postMessage('Temp: ' + temp + ' type: ' + descript)

    }
  })
}

const mathMessage = function(input) {

  request(`http://api.wolframalpha.com/v2/query?input=${input}&appid=Q6JAR2-4E7J96KE5H`, function(error, response, body) {
    if (!error && response.statusCode === 200) {

      parseString(body, function(err, result) {
        if (!err) {
          postMessage(result.title)
        }

      })

    }
  })
}

const respond = function() {
  const request = JSON.parse(this.req.chunks[0])
  const botRegex = /^\/sports guy$/
  const botRegex1 = /^\/weather$/
  const giphyCommand = '/giphy'
  const mathCommand = '/math'

  if (request.text && botRegex.test(request.text)) {
    this.res.writeHead(200)
    sportMessage()
    this.res.end()
  }
  else if (request.text && botRegex1.test(request.text)) {
    this.res.writeHead(200)
    weatherMessage()
    this.res.end()
  }
  else if (request.text &&
     request.text.length > giphyCommand.length &&
     request.text.substring(0, giphyCommand.length) === giphyCommand) {
    this.res.writeHead(200)
    searchGiphy(request.text.substring(giphyCommand.length + 1))
    this.res.end()
  }
  else if (request.text &&
     request.text.length > mathCommand.length &&
     request.text.substring(0, mathCommand.length) === mathCommand) {
    this.res.writeHead(200)
    mathMessage(request.text.substring(mathCommand.length + 1))
    this.res.end()
  }
  else {
    console.log("don't care")
    this.res.writeHead(200)
    this.res.end()
  }
}

exports.respond = respond
