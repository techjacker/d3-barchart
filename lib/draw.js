if (require !== 'undefined') {
	var d3 = require('d3');
}

var Graph = {};

/*--------------------------------------
main fn
---------------------------------------*/
Graph.drawData = function () {
	// console.log("drawBars");
	this.drawBars();
};


/*--------------------------------------
helpers
---------------------------------------*/
Graph.drawBars = function () {

	return this.get('svg')
		.selectAll(".bar").data(this.get('data'))
		.enter().append("rect")
			.attr("class", "bar")
			.attr("fill", this.get('lineColor'))
			.attr("x", this.get('xDataCoordsFn'))
			.attr("y", this.get('yDataCoordsFn'))
			.attr("height", this.get('yDataCoordsFnHeight'))
			.attr("width", this.get('barWidth'));
};




/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}