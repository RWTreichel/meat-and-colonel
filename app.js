var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.set('port', (process.env.PORT || 3000));

app.use(express.static(__dirname + '/client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/api/placetile', function(req, res) {
  var data = req.body;

  res.status(200).json({x: data.x, y: data.y});
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});