/* Resource Creator */
module.exports = context => {

	const chai = require('chai');
	const chaiHttp = require('chai-http');
	chai.use(chaiHttp);
	const agent = (
		chai.request
		.agent(context.baseUrl)
	);
	return agent;

};

/* Process resource instance */
module.exports.do = async (unit, { request }) => {
	switch (unit.method) {

		case 'get':
			return await request[unit.method](unit.path);
		case 'post':
			return await (request[unit.method](unit.path)
			.type(unit.reqType || 'json')
			.send(unit.body));

	}
};
