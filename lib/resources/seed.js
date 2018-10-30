const fs = require('fs-extra');
const requireDirectory = require('require-directory');
const JSONT = require('@codefeathers/jsont');

/**
 * Resource creator for 'seed' resource.
 * @param {object} context
 * @param {string} context.templates
 * @param {object} options
 * @param {string} options.basePath
 */
module.exports = (context, options) => {

	if (typeof context.templates === 'object')
		return context.templates;

	if (typeof context.templates !== 'string')
		throw new Error(
			`${context.templates} is not a string!`
			+ `\n^^^`
		)

	if (context.templates.slice(0, 3) !== '#!/')
		throw new Error(
			`template path does not start with '#!/'\n`
			+ context.templates.slice(0, 10)
			+ `\n^^^`
		);

	const templatesPath =
		options.basePath + context.templates.slice(2);

	return requireDirectory(
		module,
		options.basePath,
		{ include: /.*template.json$/ },
	);

};

const range = n => Array(n).fill(undefined).map((x, i) => i);

module.exports.do = (unit, { db }) => {

	switch (unit.flow) {

		case 'createUser':
			return [range(unit.count).map(() => {
				
			})].map(x => db['userdetails'].insertMany(x));
		// case 'createProspect':

	}

};

