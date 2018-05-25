const gr_data = require('../../grextended_data');
const GlideRecord = require('../../classes/gliderecord')(gr_data);
const GRExtended = require('../../tools/grextended');

describe('GRExtended', () => {
	let gr, testFn;
	beforeEach(() => {
		gr = GRExtended('incident');
		testFn = jest.fn();
	});

	describe('gMap', () => {
		it('Should be a function', () => expect(gr.gMap).toBeInstanceOf(Function));

		it('Should return an array', () => expect(gr.gQuery().gMap(x => x)).toBeInstanceOf(Array));

		it('Should return array of values', () => expect(gr.gQuery().gMap(x => x.getValue('number'))[0]).toBe(gr_data[0].number));

		it('Should be method-chainable with Array methods', () => {
			gr
				.gQuery()
				.gMap(x => x.sys_id)
				.forEach(id => testFn());

			expect(testFn).toBeCalled();
		});
	});

	describe('gForEach', () => {
		it('Should be a function', () => expect(gr.gForEach).toBeInstanceOf(Function));

		it('Should iterate over records', () => gr.gQuery().gForEach(x => expect(x.getValue('sys_class_name')).toBe('incident')));
	});

	describe('gfilter', () => {
		it('Should be a function', () => expect(gr.gForEach).toBeInstanceOf(Function));

		it('Should filter records', () => {
			var filtered = gr.gQuery().gFilter(x => {
				x.getValue('number');
				return x.getValue('number') === gr_data[0].number;
			});

			expect(filtered.getEncodedQuery()).toBe(`sys_idIN${gr_data[0].sys_id}`);
		});

		it('Should be chainable with another function', () => {
			gr
				.gQuery()
				.gFilter(x => x.sys_id === 'id1')
				.gForEach(x => testFn());

			expect(testFn).toBeCalled();
		});
	});

	describe('gReduce', () => {
		it('Should be a function', () => expect(gr.gReduce).toBeInstanceOf(Function));

		it('Should reduce a list of records', () => {
			var result = gr.gQuery().gReduce((acc, record) => {
				return acc + parseInt(record.getValue('cost'), 10);
			}, 0);
			expect(result).toEqual(100);
		});
	});

	describe('gSome', () => {
		it('Should be a function', () => expect(gr.gQuery().gSome).toBeInstanceOf(Function));

		it('Should be able to return true', () => expect(gr.gQuery().gSome(x => x.getValue('sys_id') === gr_data[0].sys_id)).toBe(true));
		it('Should be able to return false', () => expect(gr.gQuery().gSome(x => x.getValue('fail') === gr_data[0].sys_id)).toBe(false));
	});

	describe('gFind', () => {
		it('Should be a function', () => expect(gr.gQuery().gFind).toBeInstanceOf(Function));
		it('Should find a record', () => expect(gr.gQuery().gFind(x => x.getValue('sys_id') === 'id2').sys_id).toBe('id2'));
		it('Should fail to find a record', () => expect(gr.gQuery().gFind(x => false)).toBe(undefined));
	});

	describe('gJson', () => {
		it('Should be a function', () => expect(gr.gQuery().gNext().gJson).toBeInstanceOf(Function));
		fit('Should turn a record into JSON', () => {
			expect(typeof gr.gGet(gr_data[0].sys_id).gJson()).toBe('string');
			expect(typeof JSON.parse(gr.gGet(gr_data[0].sys_id).gJson())).toBe('object');
		});
	});
});
