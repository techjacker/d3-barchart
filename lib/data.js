if (require !== 'undefined') {
	var d3 = require('d3');
}

var Graph = {};


Graph.setBarWidth = function () {
	var dataLen = this.get('data').length,
		gWidth = this.get('graphWidth'),
		barWidth = gWidth/(dataLen+1),
		barGap = (gWidth - (dataLen * barWidth))/dataLen;

	return this.set({
		'barWidth': barWidth,
		'barGap': barGap
	});
};


Graph.setData = function (data) {
	this.super_.setData.call(this, data);
	return this.setBarWidth();
};


/*--------------------------------------
sdf
---------------------------------------*/
Graph.setScale = function () {

	var dataLen = this.get('data').length,
		gWidth = this.get('graphWidth'),
		barWidth = this.get('barWidth'),
		barGap = this.get('barGap'),
		// + barGap >> so have gap before first bar
		x = d3.time.scale().range([(barWidth/2) + barGap, gWidth - (barWidth/2)]);

	return this.set({
		x: x,
		y: d3.scale.linear().range([this.get('graphHeight'), 0])
	});
};


Graph.setDataCoordsFns = function () {
	var x = this.get('x'),
		y = this.get('y'),
		xDataKey = this.get('xDataKey'),
		yDataKey = this.get('yDataKey'),
		graphHeight = this.get('graphHeight'),
		barWidth = this.get('barWidth');

	return this.set({
		xDataCoordsFn: function(d) {
			return x(d[xDataKey]) - (barWidth/2) ;
		},
		yDataCoordsFn: function(d) {
			return y(d[yDataKey]);
		},
		yDataCoordsFnHeight: function(d) {
			return graphHeight - y(d[yDataKey]);
		}
	});
};

Graph.setTicks = function (data) {

	return this.set({
		xTicks: 3,
		yTicks: 3
	});
};

/*--------------------------------------
Exports
---------------------------------------*/
if (module !== 'undefined' && module.exports) {
	module.exports = Graph;
}