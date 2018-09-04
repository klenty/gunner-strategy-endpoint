const Strategy = require('@klenty/gunner/Strategy');

const resources = require('./lib/resources');
const compiler = require('./lib/compiler');

const endpointStrategy =
	new Strategy(
		'endpoint',
		resources,
		compiler,
	);

module.exports = endpointStrategy;