var express = require('express');
var fs = require('fs');
var Q = require('q');

var urf = express();
var api = require('./server');
var port = process.env.PORT || 9001;

var setup = {
	init: require('./scripts/init.js'),
	scripts: require('./scripts/scripts.js'),
	css: require('./scripts/styles.js')
};

console.log('Creating public folder and starting urf server');
setup.init(__dirname)
.then(function() {
	return setup.css(__dirname);
})
// once we're done 
.done(function() {
	setup.scripts(__dirname)
		.pipe(fs.createWriteStream('public/js/bundle.js'))
		.on('finish', startServer)
		.on('error', handleBreakage);
});


function startServer() {
	urf.configure(function() {
		urf.use('/', express.static(__dirname + 'public/'));
		urf.use('/api', api);
	});

	urf.listen(port);
	console.log('lsitening on port: ' + port);
}

function handleBreakage() {
	console.err.apply(console, arguments);
	process.exit(1);
}