const GlideFilter = require('../../classes/glidefilter');
const GlideRecord = require('../../classes/gliderecord')();

describe('GlideFilter', () => {
	let gRecord;
	beforeEach(() => {
		gRecord = new GlideRecord('test');
		gRecord._STATE.CURRENT_RECORD = { active: 'true', state: '5' };
	});

	it('should have a checkRecord method', () => {
		expect(typeof GlideFilter.checkRecord).toBe('function');
	});

	it('should return true if field matches encoded query', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=true', false);

		expect(test).toEqual(true);
	});

	it('should return false if field does not match the encoded query', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=false', false);

		expect(test).toEqual(false);
	});

	it('should return true if all fields match and all are required to match ', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=true&state=5', true);

		expect(test).toEqual(true);
	});

	it('should return false if all fields do not match and all are required to match ', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=true&state=4', true);

		expect(test).toEqual(false);
	});

	it('should return true if found in an IN query', () => {
		const test = GlideFilter.checkRecord(gRecord, 'stateIN1,2,3,4,5', false);

		expect(test).toEqual(true);
	});

	it('should return false if not found in an IN query', () => {
		const test = GlideFilter.checkRecord(gRecord, 'stateIN1,2', false);

		expect(test).toEqual(false);
	});

	it('should return true if found in an IN query and matching all', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=true&stateIN1,2,5', false);

		expect(test).toEqual(true);
	});

	it('should return false if not found in an IN query and matching all', () => {
		const test = GlideFilter.checkRecord(gRecord, 'active=true&stateIN1,2,3,4', true);

		expect(test).toEqual(false);
	});
});
