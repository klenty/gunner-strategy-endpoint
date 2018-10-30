const Mongoose = require("mongoose");

/* Resource creator */
module.exports = context => {

	const mongoose = new Mongoose.Mongoose();
	mongoose.connect(
		context.connectionString,
		{ useNewUrlParser: true }
	);
	const db = context.collections.reduce((dbObj, coll) => {
		dbObj[coll] = mongoose.model(coll,
			new mongoose.Schema({}, { strict: false }));
		return dbObj;
	}, {});

	db.__mongoose__ = mongoose;

	return db;

};

/* Process resource instance */
module.exports.do = async (unit, { db }) => {

	if (!unit.hasOwnProperty('method')) unit.method = 'findOne';
	const exec = [ 'create', 'insertMany' ].indexOf(unit.method) === -1;
	const action = db[unit.collection][unit.method](
		unit.query || unit.insert,
		unit.update || unit.queryList,
	);

	return !exec ? await action : action.exec();

};
