const Gunner = require('@klenty/gunner');

const convertHook = require('./units/convertHook');
const convertTest = require('./units/convertTest');

module.exports = strategy => plan => {

	const gunner = new Gunner(plan.name);

	gunner.before(Gunner.Start, () => {
		return strategy.createResource(
			'request',
			plan.resources.request,
		);
	});

	gunner.before(Gunner.Start, () => {
		return strategy.createResource(
			'db',
			plan.resources.db,
		);
	});

	const addHook = convertHook(gunner);

	// Convert 'before' hooks
	(plan.before || []).forEach(addHook('before'));

	// Convert tests
	(plan.tests || []).forEach(convertTest(gunner));

	// Convert 'after' hooks
	(plan.after || []).forEach(addHook('after'));

	const closeConnections = db => {
		return db.__mongoose__
		&& db.__mongoose__.connection.close();
	};

	gunner.after(Gunner.End, state => {
		const [ , db ] = state['@start'];
		return closeConnections(db);
	});

	return gunner;

};
