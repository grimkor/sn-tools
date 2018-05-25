module.exports = function() {
	return {
		files: [
			'/**/*.js',
			'package.json', // <--
			'!src/**/__tests__/*.js',
			'!node_modules/**/*.js',
			'!tests/**/*.js'
		],

		tests: ['tests/**/*test.js'],

		env: {
			type: 'node',
			runner: 'node'
		},

		testFramework: 'jest',

		setup: function(wallaby) {
			var jestConfig = require('./package.json').jest;
			// for example:
			// jestConfig.globals = { "__DEV__": true };
			wallaby.testFramework.configure(jestConfig);
		}
	};
};
