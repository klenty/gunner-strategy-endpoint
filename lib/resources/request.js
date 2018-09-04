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
