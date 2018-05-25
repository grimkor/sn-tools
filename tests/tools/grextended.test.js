const gr_data = [
	{
		sys_id: 'id1',
		sys_class_name: 'incident',
		number: 'NUM00001',
		description: 'Description 1'
	},
	{
		sys_id: 'id2',
		sys_class_name: 'incident',
		number: 'NUM00002',
		description: 'Description 2'
	},
	{
		sys_id: 'id3',
		sys_class_name: 'incident',
		number: 'NUM00003',
		description: 'Description 3'
	},
	{
		sys_id: 'id4',
		sys_class_name: 'incident',
		number: 'NUM00004',
		description: 'Description 4'
	}
];
const GlideRecord = require('../../classes/gliderecord')(gr_data);

const GRExtended = require('../../tools/grextended');

describe('GRExtended', () => {
	describe('gMap', () => {
		it('Should be a function', () => {
			var gr = GRExtended('incident');
			expect(gr.gMap).toBeInstanceOf(Function);
		});

		it('Should return an array', () => {
			var gr = GRExtended('incident');
			gr.setMockRecords(gr_data);
			var map = gr.gQuery().gMap(x => x);

			expect(map).toBeInstanceOf(Array);
		});

		it('Should return array of values', () => {
			var gr = GRExtended('incident');
			gr.setMockRecords(gr_data);
			var map = gr.gQuery().gMap(x => x.getValue('number'));

			expect(map[0]).toBe(gr_data.map(x => x.number)[0]);
		});
	});

	describe('gForEach', () => {
		it('Should be a function', () => {
			var gr = GRExtended('incident');
			expect(gr.gForEach).toBeInstanceOf(Function);
		});

		it('Should iterate over records', () => {
			var gr = GRExtended('incident');
			gr.setMockRecords(gr_data);
			gr.gQuery().gForEach(x => expect(x.getValue('sys_class_name')).toBe('incident'));
		});
	});

	describe('gfilter', () => {
		it('Should be a function', () => {
			var gr = GRExtended('incident');
			expect(gr.gForEach).toBeInstanceOf(Function);
		});

		it('Should filter records', () => {
			var gr = GRExtended('incident');
			gr.setMockRecords(gr_data);
			var filtered = gr.gQuery().gFilter(x => {
				x.getValue('number');
				return x.getValue('number') === gr_data[0].number;
			});

			filtered.gNext().getValue('number');
			expect(filtered.getEncodedQuery()).toBe(`sys_idIN${gr_data[0].sys_id}`);
		});
	});
});
