const Shotgun = require('shotgun-query');

module.exports = (expectable, expect, docs) => {
	const unitExpects = [];

	if (expectable.checks) {

		unitExpects.push(expect(expectable.checks).isArray());

		expectable.checks.forEach(check =>

			unitExpects.push(
					new Shotgun(check).eval(docs).call(expect))

		);

	}

	return Promise.all(unitExpects);
};
