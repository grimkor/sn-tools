module.exports = mockRecords => {
	return class GlideRecord {
		constructor(tableName) {
			if (!tableName || typeof tableName !== 'string') {
				throw new Error('No table specified in constructor');
			}

			this._QUERY = {
				TABLE: tableName,
				QUERY: [],
				ROW_POSITION: 0,
				MOCK_RECORDS: mockRecords || [],
				RECORDS: null
			};
			this._STATE = {
				HAS_QUERIED: false,
				INITIALIZED: false,
				CURRENT_RECORD: {}
			};

			return new Proxy(this, {
				get(target, name) {
					if (!target[name]) {
						return target.getValue(name);
					} else {
						return target[name];
					}
				}
			});
		}

		setMockRecords(records) {
			if (this._areRecordsValid(records)) {
				this._QUERY.MOCK_RECORDS = [...records];
				this._QUERY.MOCK_RECORDS;
			}
		}

		_setMockToRecords() {
			if (this._areRecordsValid(this._QUERY.MOCK_RECORDS)) {
				this._QUERY.RECORDS = [...this._QUERY.MOCK_RECORDS];
			}
		}

		_areRecordsValid(records) {
			!!records;
			if (!!records && records instanceof Array) {
				return true;
			} else {
				throw new Error('invalid or no mock records set');
			}
		}

		addQuery(field, value, complexValue) {
			if (!complexValue) {
				this._QUERY.QUERY.push(`${field}=${value}`);
			} else {
				if (this._isValidArgument(value)) {
					this._QUERY.QUERY.push(`${field}${value}${complexValue}`);
				}
			}
		}

		_isValidArgument(arg) {
			const valid = ['IN'];
			return valid.includes(arg);
		}

		getEncodedQuery() {
			return this._QUERY.QUERY.join('&');
		}

		getTableName() {
			return this._QUERY.TABLE;
		}

		query() {
			this._query();
		}

		_query() {
			this._STATE.HAS_QUERIED = true;
			this._QUERY.ROW_POSITION = 0;
			this._filterRecordsByQuery();
			this._setMockToRecords();
		}
		_filterRecordsByQuery() {
			const query = this._QUERY.QUERY.map(x => x.split('='));
			const filtered = this._QUERY.MOCK_RECORDS.filter(x => {
				return (
					query.length === 0 ||
					query.reduce((acc, q) => {
						if (q.length === 1) {
							return acc && this._testComplexQueryPart(x, q[0]);
						}
						return acc && x[q[0]] == q[1];
					}, true)
				);
			});
			this._QUERY.MOCK_RECORDS = [...filtered]; 
		}

		_testComplexQueryPart(record, query) {
			if (query.includes('IN')) {
				var split = query.split('IN');
				var values = split[1].split(',');
				var prop = split[0];
				values.includes(record[prop]);

				return values.includes(record[prop]);
			}
		}

		get(id) {
			this._STATE.HAS_QUERIED = true;
			this._QUERY.RECORDS = this._QUERY.MOCK_RECORDS.filter(x => x.sys_id === id);
			this._setCurrentRecord();
			return !!this._STATE.CURRENT_RECORD;
		}

		next() {
			return this._next();
		}

		_next() {
			if (this._STATE.HAS_QUERIED && this._hasNext()) {
				this._setCurrentRecord();
				this._QUERY.ROW_POSITION++;
				return true;
			} else {
				return false;
			}
		}

		_setCurrentRecord() {
			this._STATE = {
				...this._STATE,
				CURRENT_RECORD: this._QUERY.RECORDS[this._QUERY.ROW_POSITION]
			};
		}

		hasNext() {
			return this._hasNext();
		}

		_hasNext() {
			if (this._areRecordsValid(this._QUERY.RECORDS)) {
				const { ROW_POSITION } = this._QUERY;
				return this._getRowCount() > ROW_POSITION;
			}
			return false;
		}
		getRowCount() {
			return this._getRowCount();
		}
		_getRowCount() {
			return this._QUERY.RECORDS.length;
		}

		getValue(field) {
			return this._STATE.CURRENT_RECORD[field] || '';
		}

		getDisplayValue(field) {
			return this.getValue(field);
		}

		setValue(field, value) {
			this._setValue(...arguments);
		}

		_setValue(field, value) {
			this._STATE.CURRENT_RECORD[field] = value;
		}

		initialize() {
			this._STATE.INITIALIZED = true;
			this._STATE.CURRENT_RECORD = {};
		}

		insert() {
			if (!this._STATE.INITIALIZED) {
				throw new Error('Record should be initialized before insert');
			} else {
				let guid = this._createGuid();
				this._STATE.INITIALIZED = false;
				this._STATE.CURRENT_RECORD.sys_id = guid;
				return guid;
			}
		}

		_createGuid() {
			return (
				this._s4() +
				this._s4() +
				this._s4() +
				this._s4() +
				this._s4() +
				this._s4() +
				this._s4() +
				this._s4()
			);
		}

		_s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
	};
};
