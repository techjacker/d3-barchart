if (typeof require !== 'undefined') {
	var graph = require('../lib/main.js');
	var expect = require('expect.js');

}
describe('component', function () {
	it('should export a function', function () {
		expect(graph).to.be.a('function');
	});
});