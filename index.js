var express     = require('express'),
    browserify  = require('browserify-middleware'),
    path        = require('path');

var app = express();
app.set('port', (process.env.PORT || process.argv[2] || 5000));
app.use('/client', browserify(__dirname + '/client'));
app.use('*', express.static(__dirname + '/static'));

app.listen(app.get('port'), function() {
  console.log('Started listening on port', app.get('port'));
});
