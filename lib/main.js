if (typeof require !== 'undefined') {

	// private deps
	var d3BaseGraph = require('d3base');

	// public deps
	var mitsubishi = require('mitsubishi');
	var extend = require('extasy');

	// lib files > decorate prototype
	var setup = require('./setup.js');
	var data = require('./data.js');
	var draw = require('./draw.js');
}

var BarChart = function (opts) {

	if (!(this instanceof BarChart)) {
		return new BarChart(opts);
	}

	// call base class constructor fn
	d3BaseGraph.call(this, opts);

	this.set({
		'type': 'barchart'
	});
};


// inherit from base class BEFORE decorating prototype with this module's libs
extend(BarChart, d3BaseGraph);
mitsubishi.props(BarChart.prototype, [draw, data, setup]);

/*--------------------------------------
Exports
---------------------------------------*/
if (typeof module !== 'undefined' && module.exports) {
	module.exports = BarChart;
}
