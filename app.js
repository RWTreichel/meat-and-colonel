var express = require('express');
var bodyParser = require('body-parser');
var game = require('./server/game.js');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/placetile', function(req, res) {
  var data = req.body;
  console.log('Received the following from the client: ' + JSON.stringify(data));

  var tile = game.deck.pop();
  tile.x = data.x;
  tile.y = data.y;
  game.placeTile(tile);

  console.log('Tile placed on board: ' + JSON.stringify(game.board[data.x][data.y]));

  res.status(200).json({x: data.x, y: data.y, "tile": tile});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

module.exports = app;