const requestor = async (unit, request) => {
	switch (unit.method) {

		case 'get':
			return await request[unit.method](unit.path);
		case 'post':
			return await (request[unit.method](unit.path)
			.type(unit.reqType || 'json')
			.send(unit.body));

	}
};

const dbAction = async (unit, db) => {
	if (!unit.hasOwnProperty('method')) unit.method = 'findOne';
	const exec = [ 'create', 'insertMany' ].indexOf(unit.method) === -1;
	const action = db[unit.collection][unit.method](
		unit.query || unit.insert,
		unit.update || unit.queryList,
	);

	return !exec ? await action : action.exec();
};

module.exports = async (unit, state) => {
	const [ request, db ] = state['@start'];
	switch (unit.type) {

		case 'request':
			return await requestor(unit, request);
		case 'db':
			return await dbAction(unit, db);
		default:
			throw new Error(
				`Unknown before hook type: ${unit.type}`
			);

	}
};
