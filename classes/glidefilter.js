module.exports = {
	checkRecord(record, filter, matchAll) {
		return this._checkRecord(record, filter, matchAll);
	},

	_checkRecord(record, filter, matchAll) {
		const query = filter.split('&').map(x => x.split('='));
		if (query.length === 0) {
			return true;
		} else {
			return query.reduce((acc, q) => {
				let bool;
				if (q.length === 1) {
					bool = this._testComplexQueryPart(record, q[0]);
				} else {
					bool = record[q[0]] == q[1];
				}
				return matchAll ? bool && acc : acc || bool;
			}, matchAll);
		}
	},

	_testComplexQueryPart(record, query) {
		if (query.includes('IN')) {
			var split = query.split('IN');
			var values = split[1].split(',');
			var prop = split[0];
			values.includes(record[prop]);

			return values.includes(record[prop]);
		}
	}
};
