const resources = require('../resources');

module.exports = async (unit, state) => {

	const instances = {
		request: state['@start'].request,
		db: state['@start'].db,
	};

	return resources[unit.type].do(unit, instances);

};
