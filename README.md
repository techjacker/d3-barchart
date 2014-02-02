# d3-barchart

Base d3 barchart class


### Install

#### Node

```Shell
npm install d3-barchart
```

#### Browser

```Shell
component install d3-barchart
```

```Shell
bower install d3-barchart
```


## Usage

#### d3-barchart(opts)

```JavaScript
GreatBarChart = d3-barchart({

	// mandatory
	el:'#containerDiv',
	xDataKey:"year",
	yDataKey:"Prevalence Per 1,000 Animals",

	// optional
	centerGraph:true,
	gradient:true,
	fill:true,
	lineColor: 'red'
});
```

GreatBarChart.draw()


### Options




### Docs
[Yuidocs documentation here](docs/index.html)
- fire up the connect server ```$ grunt docs```
- navigate your browser to the [docs](http://localhost:9001)


## License
Copyright (c) 2014 Andrew Griffiths <mail@andrewgriffithsonline.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.