const GlideRecord = require('../../classes/gliderecord')();

describe('GlideRecord', () => {
	it('can create an instance of itself', () => {
		expect(new GlideRecord('test')).toBeInstanceOf(GlideRecord);
	}),
		it('returns an error when no table is specified', () => {
			expect(() => new GlideRecord()).toThrow(Error);
			expect(() => new GlideRecord({})).toThrow(Error);
			expect(() => new GlideRecord([])).toThrow(Error);
			expect(() => new GlideRecord(123)).toThrow(Error);
			expect(() => new GlideRecord(() => {})).toThrow(Error);
		});

	it('accept mock records', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [
			{
				sys_id: 'abc123imasysid1',
				number: 'TEST0000001'
			}
		];
		gr.setMockRecords(mockRecords);
		expect(gr._QUERY.MOCK_RECORDS).toEqual(mockRecords);
	});

	it('should throw an error on invalid mockrecord type', () => {
		const gr = new GlideRecord('test');

		expect(() => gr.setMockRecords()).toThrow(Error);
		expect(() => gr.setMockRecords({})).toThrow(Error);
		expect(() => gr.setMockRecords('test')).toThrow(Error);
	});

	it('should add a query to its query string', () => {
		const gr = new GlideRecord('test');
		gr.addQuery('field', 'value');
		const expectedQuery = 'field=value';

		expect(gr.getEncodedQuery()).toEqual(expectedQuery);
	});

	it('should add a complex query to its query string', () => {
		const gr = new GlideRecord('test');
		gr.addQuery('field', 'IN', ['id1', 'id2', 'id3']);
		const expectedQuery = 'fieldINid1,id2,id3';

		expect(gr.getEncodedQuery()).toEqual(expectedQuery);
	});

	it('should perform an "IN" query', () => {
		const mockRecords = [{ sys_id: 'id1' }, { sys_id: 'id2' }, { sys_id: 'id3' }];
		const gr = new GlideRecord('test');
		gr.setMockRecords(mockRecords);
		gr.addQuery('sys_id', 'IN', ['id1', 'id3']);
		gr.query();

		expect(gr.getRowCount()).toEqual(2);
	});

	it('should return its query string', () => {
		const gr = new GlideRecord('test');
		gr.addQuery('field', 'value');
		const expectedQuery = 'field=value';

		expect(gr.getEncodedQuery()).toEqual(expectedQuery);
	});

	it('should query and have results', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id' }];
		gr.setMockRecords(mockRecords);
		gr.query();
		expect(gr._QUERY.RECORDS).toEqual(mockRecords);
	});

	it('should query and filter results based on query string', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }, { sys_id: 'test_sys_id2' }];
		gr.setMockRecords(mockRecords);
		gr.addQuery('sys_id', 'test_sys_id1');
		gr.query();
		gr._QUERY.RECORDS;
		expect(gr._QUERY.RECORDS).toHaveLength(1);
	});

	it('should get a single record', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id' }];
		gr.setMockRecords(mockRecords);
		gr.get('test_sys_id');

		expect(gr._STATE.CURRENT_RECORD).toEqual(mockRecords[0]);
	});

	it('should move mock records to record set', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id' }];
		gr._QUERY.MOCK_RECORDS = mockRecords;
		gr._setMockToRecords(mockRecords);

		expect(gr._QUERY.MOCK_RECORDS).toEqual(gr._QUERY.RECORDS);
	});

	it('should allow to iterate through records', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }, { sys_id: 'test_sys_id2' }];
		gr.setMockRecords(mockRecords);
		gr.query();
		let i = 0;
		while (gr.next()) {
			expect(gr._STATE.CURRENT_RECORD).toEqual(gr._QUERY.RECORDS[i++]);
		}
	});

	it('should get the row count', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }, { sys_id: 'test_sys_id2' }];
		gr.setMockRecords(mockRecords);
		gr.query();

		expect(gr.getRowCount()).toEqual(mockRecords.length);
	});

	it('should return if there is a next record', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }];
		gr.setMockRecords(mockRecords);
		gr.query();

		expect(gr.hasNext()).toEqual(true);

		const grNegative = new GlideRecord('test');
		grNegative.setMockRecords([]);
		grNegative.query();

		expect(grNegative.hasNext()).toEqual(false);
	});

	it('should allow to get a value with getValue()', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }, { sys_id: 'test_sys_id2' }];
		gr.setMockRecords(mockRecords);
		gr.query();
		let i = 0;
		while (gr.next()) {
			expect(gr.getValue('sys_id')).toEqual(mockRecords[i++].sys_id);
			expect(gr.getValue('nonexistant_field')).toEqual('');
		}
	});

	it('should allow to get a value with record.field', () => {
		const gr = new GlideRecord('test');
		const mockRecords = [{ sys_id: 'test_sys_id1' }, { sys_id: 'test_sys_id2' }];
		gr.setMockRecords(mockRecords);
		gr.query();
		let i = 0;
		while (gr.next()) {
			expect(gr.sys_id).toEqual(mockRecords[i++].sys_id);
		}
	});

	it('should set a value', () => {
		var gr = new GlideRecord('test');
		gr._STATE.CURRENT_RECORD;
		gr.setValue('field', 'value');
		expect(gr.getValue('field')).toEqual('value');
	});

	it('should initialize', () => {
		var gr = new GlideRecord('test');
		gr.initialize();
	});

	it('should insert and return a sys_id', () => {
		var gr = new GlideRecord('test');
		gr.initialize();
		const id = gr.insert();
		expect(id).toHaveLength(32);
		expect(typeof id).toBe('string');
	});
});
