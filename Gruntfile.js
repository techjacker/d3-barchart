module.exports = function(grunt) {

	//////////////////
	// config vars  //
	//////////////////
	// files: ['!node_modules/**/*.js', '**/*.js', '**/*.html']
	// filesLib = ['index.js', 'lib/**/*.js'],
	var docsTmplDir = 'docs-tmpl',
		filesDocsTmpl = docsTmplDir + '/**/*.tmpl',
		msPrivateLibDir = '/home/andy/lib/modules/components-private/medicinestats.com',
		filesLibStr = 'lib/**/*.js',
		filesCSSStr = 'css/**/*.css',
		filesTmplStr = 'tmpl/**/*.tmpl',
		subModFiles = [
			msPrivateLibDir + '/d3-graph/build/*',
			msPrivateLibDir + '/ms-graph/build/*',
			msPrivateLibDir + '/graph-metadata/build/*',
			msPrivateLibDir + '/mstats-logo/build/*',
			msPrivateLibDir + '/footer/build/*',
		],
		filesTest = ['test/**/*.test.js'],
		filesLib = [filesLibStr],
		filesCSS = [filesCSSStr],
		filesTmpl = [filesTmplStr, 'tmpl/**/*.mustache'],
		filesData = ['public/data/**/*.json'],
		filesTestLib = filesTest.concat(filesLib, filesCSS, filesTmpl),
		filesWatch = filesTestLib.concat(['test/index.html', 'Gruntfile.js', 'component.json', filesDocsTmpl, filesData, filesCSS, subModFiles]),
		tasksBuild = ['yuidoc', 'readme'],
		tasksDev = ["connect", "watch"],
		tasksTest = ["connect", "saucelabs-mocha"],
		// tasksWatch = tasksBuild.concat(['component-build', 'jshint']), // build yuidocs as well (slower)
		tasksWatch = ['component-build', 'jshint'],
		browsers = [],
		processReadmeHeaderSrc          = docsTmplDir + '/README_header.md.tmpl',
		processReadmeHeaderDestination  = docsTmplDir + '/README_header.md',
		processLicenseSrc               = docsTmplDir + '/LICENSE.tmpl',
		processLicenseDestination       = 'LICENSE',
		npmConfig 						= grunt.file.readJSON('package.json'),
		filesPreProcess 				= {};

	npmConfig.year = grunt.template.today('yyyy');
	filesPreProcess[docsTmplDir + '/README_header.md'] = docsTmplDir + '/README_header.md.tmpl';
	filesPreProcess[docsTmplDir + '/LICENSE.tmpl'] = 'LICENSE';

	/////////////////////////////
	// Project configuration.  //
	/////////////////////////////
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		preprocess: {
			options: {
				context: {
					year: grunt.template.today('yyyy')
				}
			},
			readme: {
				options: {
					context: npmConfig
				},
				files: filesPreProcess
			}
		},
		concat: {
			options: {
				separator: ''
			},
			//  // '2013'
			dist: {
				src: [docsTmplDir + '/README_header.md', docsTmplDir + '/README_footer.md', 'LICENSE'],
				dest: 'README.md'
			}
		},
		connect: {
			saucelabs: {
				options: {
					base: '.',
					port: 8080
				}
			},
			servermanualtest: {
				options: {
					base: '.',
					keepalive: true,
					port: 9090
				}
			}
		},
		yuidoc: {
			compileA: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.repository.url %>',
				options: {
					paths: 'lib/',
					outdir: 'docs/'
				}
			}
		},
		'saucelabs-mocha': {
			all: {
				options: {
					urls: ['http://localhost:8080/test'], // grunt-connect
					tunnelTimeout: 5,
					detailedError: true,
					concurrency: 3,
					build: process.env.TRAVIS_JOB_ID,
					browsers: browsers,
					testname: "mocha tests"
				}
			}
		},
		jshint: {
			all: {
				files: {
					src: filesLib
				},
				options: {
					jshintrc: '.jshintrc'
				}
			}
		},
		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 2, // maximum number of notifications from jshint output
				title: "d3-barchart" // defaults to the name in package.json, or uses project's directory name, you can change to the name of your project
			}
		},
		clean: [docsTmplDir + "/**/*.md"],
		watch: {
			options: {
				// livereload: 35101
				livereload: 35100
			},
			files: filesWatch,
			tasks: tasksWatch
			// tasks: tasksBuild
		}
	});

	/*--------------------------------------
	Readme custom task
	---------------------------------------*/
	grunt.registerTask("readme-concat", ["preprocess:readme", "concat", "clean"]);
	// keep in here for the watch task
	grunt.registerTask('readme', 'Concatenate readme docs', function() {
		var done = this.async();
		var exec = require('child_process').exec;
		exec('make readme', function(error, stdout, stderr) {
			done();
		});
	});

	grunt.registerTask('component-build', 'Build component', function() {
		var done = this.async();
		var exec = require('child_process').exec;
		exec('make public-quick', function(error, stdout, stderr) {
			done();
		});
	});


	///////////////////////////
	// Loading dependencies  //
	///////////////////////////
	for (var key in grunt.file.readJSON("package.json").devDependencies) {
		if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
	}

	// register tasks
	grunt.registerTask("template", ["preprocess:readme"]);
	grunt.registerTask("docs", ["connect", "yuidoc"]);
	grunt.registerTask("test", ["connect:saucelabs", "saucelabs-mocha"]);
	grunt.registerTask("build", tasksBuild);
	// grunt.registerTask("default", ["connect", "watch"]);
	grunt.registerTask("default", ["watch"]);
};