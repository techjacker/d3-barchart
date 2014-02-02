if (require !== 'undefined') {
	var d3 = require('d3');
}

var Graph = {};

Graph.setColor = function (color) {

	var switchObj = {
		"blue": {
			lineColor: 'steelblue',
			areaColor: 'steelblue'
		}
	};
	return switchObj[color] || switchObj.blue;
};

/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}