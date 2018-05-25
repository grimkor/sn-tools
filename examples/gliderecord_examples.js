const GlideRecord = require('../classes/gliderecord')();
const GRExtended = require('../tools/grextended');

const mockData = [
	{
		sys_id: 'id1',
		number: 'TEST0000001',
		sys_class_name: 'incident'
	},
	{
		sys_id: 'id2',
		number: 'TEST0000002',
		sys_class_name: 'incident'
	}
];

// Example setting mock records for GlideRecord
const gr = new GlideRecord('incident');
gr.setMockRecords([
	{
		sys_id: 'id1',
		number: 'TEST0000001',
		sys_class_name: 'incident'
	},
	{
		sys_id: 'id2',
		number: 'TEST0000002',
		sys_class_name: 'incident'
	}
]);

gr.addQuery('number', 'TEST0000001');
gr.query();

while (gr.next()) {
	console.log(gr.getValue('sys_id')); // id1
}

// You can set the data set when requiring the mock GlideRecord class

const GlideRecordMock = require('../classes/gliderecord')(mockData);

const grMock = new GlideRecordMock('incident');
grMock.query();

while (grMock.next()) {
	console.log(grMock.getValue('number')) // ​​​​​TEST0000001​​​​​, ​​​​​TEST0000002​​​​​
}