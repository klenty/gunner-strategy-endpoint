const { Gunner, expect } = require('@klenty/gunner');

const convertHook = require('./units/convertHook');
const convertTest = require('./units/convertTest');

module.exports = strategy => plan => {

	const gunner = new Gunner(plan.name);

	gunner.before(
		Gunner.Start,
		() => strategy.createResource(
			'request',
			plan.resources.request,
		),
		'request',
	);

	gunner.before(
		Gunner.Start,
		() => strategy.createResource(
			'db',
			plan.resources.db,
		),
		'db',
	);

	const addHook = convertHook(gunner, expect);

	// Convert 'before' hooks
	(plan.before || []).forEach(addHook('before'));

	// Convert tests
	(plan.tests || []).forEach(convertTest(gunner, expect));

	// Convert 'after' hooks
	(plan.after || []).forEach(addHook('after'));

	const closeConnections = db => {
		return db.__mongoose__
		&& db.__mongoose__.connection.close();
	};

	gunner.before(Gunner.End, state => {
		const { db } = state['@start'];
		return closeConnections(db);
	});

	return gunner;

};
