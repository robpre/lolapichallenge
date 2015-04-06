var express = require('express');
var fs = require('fs');
var Q = require('q');

var urf = express();
var api = require('./server');
var port = process.env.PORT || 9001;

var setup = {
	init: require('./scripts/init.js'),
	scripts: require('./scripts/scripts.js'),
	css: require('./scripts/styles.js'),
	markup: require('./scripts/markup.js')
};

console.log('Creating public folder and starting urf server');
setup.init(__dirname)
.then(function() {
	var sty = Q.defer();
	setup.css(__dirname)
		.then(function(result) {
			console.log(result, 'asd');
			fs.writeFileSync(__dirname + '/public/styles.css', result.css);
			fs.writeFileSync(__dirname + '/public/styles.css.map', result.map);
			sty.resolve();
		});

	return sty;
})
.then(function() {
	return setup.markup(__dirname);
})
// once we're done 
.done(function() {
	setup.scripts(__dirname)
		.pipe(fs.createWriteStream('public/js/bundle.js'))
		.on('finish', startServer)
		.on('error', handleBreakage);
});


function startServer() {
	urf.use('/', express.static(__dirname + 'public/'));
	urf.get('/', function(req, res) {
		res.redirect('/index.html');
	});

	urf.use('/api', api);

	urf.listen(port);
	console.log('lsitening on port: ' + port);
}

function handleBreakage() {
	console.err.apply(console, arguments);
	process.exit(1);
}