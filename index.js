/* jshint asi:true */
/* jshint esversion:6 */

var express = require('express')
var bodyParser = require('body-parser')
var session = require('express-session')
var app = express()

var privateData = 'Secret data'

app.use(bodyParser.json())
app.use(session({
  secret: 'ThisIsNotSafe',
  resave: true,
  saveUninitialized: true
}))

app.use(function(req, res, next) {
  var ALLOWED_ORIGINS = [ 'http://localhost:8000', 'http://thirdparty.com:8000' ]
  if(ALLOWED_ORIGINS.indexOf(req.headers.origin) > -1) {
    res.set('Access-Control-Allow-Origin', req.headers.origin)
  } else {
    res.set('Access-Control-Allow-Origin', '*')
  }
  res.set('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.set('Access-Control-Allow-Headers', 'Content-Type')
  // Use the following header with CAUTION. Think twice if you want to expose data that is behind credentials!
  //res.set('Access-Control-Allow-Credentials', 'true')
  next()
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.get('/private', function(req, res) {
  if(req.session.loggedIn) {
    console.log('Logged in')
    res.send(`The secret is: ${privateData}`)
  } else {
    res.send('Login first')
  }
})

app.get('/public', function(req, res) {
  res.send(JSON.stringify({
    message: 'This is public info'
  }))
})

app.post('/login', function(req, res) {
  if(req.body.password === 'secret') {
    req.session.loggedIn = true
    res.send('You are now logged in!')
  } else {
    res.send('Wrong password.')
  }
})

app.listen(process.env.PORT || 3000)
