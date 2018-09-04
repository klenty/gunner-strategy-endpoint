const Mongoose = require("mongoose");

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
