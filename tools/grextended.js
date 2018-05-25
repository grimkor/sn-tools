const gr_data = require('../grextended_data');
const GlideRecord = require('../classes/gliderecord')(gr_data);

module.exports = GRExtended = function(input) {
	_METHODS = ['gMap', 'gFilter', 'gForEach', 'gReduce', 'gSome', 'gFind', 'gJson', 'gToObject', '_METHODS', 'gQuery', 'gNext', 'gGet'];

	gMap = function(func) {
		if (!func) {
			return [];
		}

		var gMap = [];
		while (this.next()) {
			gMap.push(func(this));
		}
		return gMap;
	};

	gFilter = function(func) {
		if (!func) {
			return;
		}
		var filteredRecords = [];

		while (this.next()) {
			if (func(this)) {
				filteredRecords.push(this.getValue('sys_id'));
			}
		}
		var filteredGr = GRExtended(this.getTableName());
		filteredGr.addQuery('sys_id', 'IN', filteredRecords);
		filteredGr.query();
		return filteredGr;
	};

	gForEach = function(func) {
		if (!func) {
			return;
		}

		while (this.next()) {
			func(this);
		}
	};

	gReduce = function(func, value) {
		while (this.next()) {
			value = func(value, this);
		}
		return value;
	};

	gSome = function(func) {
		var bool = false;

		while (!bool && this.next()) {
			bool = func(this);
		}
		return bool;
	};

	gFind = function(func) {
		var bool = false;

		while (!bool && this.next()) {
			bool = func(this);
		}

		return bool ? this : undefined;
	};

	gToObject = function() {
		var record = {};
		Object.getOwnPropertyNames(this).forEach(function(prop) {
			if (this._METHODS.indexOf(prop) === -1) {
				record[prop] = this.getValue(prop);
			}
		}, this);

		return record;
	};

	gJson = function() {
		var record = this.gToObject();
		return JSON.stringify(record);
	};

	gQuery = function() {
		this._query();
		return this;
	};

	gGet = function(id) {
		this.get(id);
		return this;
	};

	gNext = function() {
		this._next();
		return this;
	};

	generate = function(table) {
		var extendedGr = new GlideRecord(table);

		this._METHODS.forEach(function(prop) {
			extendedGr[prop] = this[prop];
		}, this);

		return extendedGr;
	};

	convert = function(glideRecord) {
		this._METHODS.forEach(function(prop) {
			glideRecord[prop] = this[prop];
		}, this);

		return glideRecord;
	};

	if (typeof input === 'string') {
		return this.generate(input);
	}

	if (input instanceof GlideRecord) {
		return this.convert(input);
	}
};
