const GlideRecord = require('./classes/gliderecord')();
const GRExtended = require('./classes/grextended');


var gr = GRExtended('incident');
gr.setMockRecords([
	{
		sys_id: 'abc123imasysid1',
		number: 'TEST0000001',
		sys_class_name: 'incident'
	},
	{
		sys_id: 'abc123imasysid2',
		number: 'TEST0000002',
		sys_class_name: 'incident'
	}
])
