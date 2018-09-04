const path = obj => path =>
	path.reduce((result, segment) => result && result[segment], obj);

const pickSelector = path => {
	const match = path.match(/^(res|unit)(::|$)/)[0];
	if (match === 'res::') return 0;
	if (match === 'unit::') return 1;
	return -1;
};

const parsePath = obj => pathString => {

	const paths = [];

	const normalised = pathString
	.trim()
	.replace(/^(res|unit)::/, '')
	.split('::');

	if (normalised[normalised.length - 1] === '&*') {
		const push = path(obj)(normalised.slice(0, normalised.length - 1));
		if (Array.isArray(push)) Array.prototype.push.apply(paths, push);
		else return Promise.reject(
			`${push} is not an array. Cannot run '&*' operator!`);
	} else {
		paths.push(path(obj)(normalised));
	}

	return paths;

};

const obj = {
	doc: {
		a:
			{ b: [5, 10] }
	}
};

module.exports = (expectable, expect, docs) => {
	const unitExpects = [];

	if (expectable.checks) {
		unitExpects.push(expect(expectable.checks).isArray());
		expectable.checks.forEach(check => {
			const [ pathToCheck, method, ...args ] = check;
			const selector = pickSelector(pathToCheck);
			const toChecks = parsePath(docs[selector])(pathToCheck);
			toChecks.forEach(toCheck =>
				unitExpects.push(
					expect(toCheck)[method](...args)));
		});
	}

	return Promise.all(unitExpects);
};
