const createAssertions = require('../createAssertions');
const processUnit = require('./processUnit');

module.exports = (instance, expect) => test => {
	instance.test(test.description, async state => {
		const response = await processUnit(test, state);

		let expects = [];
		const res = JSON.parse(response.res.text);
		const responseData = {
			status: response.status,
			data: res.data,
			errors: res.errors,
		};

		const awaitables = (test.expect || []).map(async ex => {

			if (ex.type === 'response')
				Array.prototype.push.apply(expects,
					await createAssertions(
						ex,
						expect,
						{ res: responseData },
					));
			else if (ex.type === 'db') {
				let data = await processUnit(ex, state);
				if (Array.isArray(data))
					data = data.map(x => x._doc);
				Array.prototype.push.apply(expects,
					await createAssertions(
						ex,
						expect,
						{ res: responseData, unit: { doc: data } },
					));
			} else
				return Promise.reject(
					`${ex.type} is not a registered resource`);
		});

		await Promise.all(awaitables);
		return expects;
	});
};
