var server = require('./server');

var hostname = process.env.HOSTNAME || 'localhost';
var port = process.env.PORT || 8080;

server.listen(port);
console.log('Listening at ' + hostname + ':' + port + '...');
