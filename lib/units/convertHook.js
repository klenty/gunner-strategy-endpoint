const Gunner = require('@klenty/gunner');

const processUnit = require('./processUnit');

module.exports = instance => when => hook => {

	const GunnerConstant = when === 'before'
		? Gunner.Start
		: Gunner.End;

	return instance[when](GunnerConstant, state =>
		processUnit(hook, state));

};
