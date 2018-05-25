// Instantiate GRExtended and treat as a normal GlideRecord class object

var incident = GRExtended('incident');
incident.addQuery('active', true);

incident.query();
incident.next();
gs.print(incident.getValue('sys_id')); // id2

// GRExtended is created to allow the use of method chaining

var incident = GRExtended('incident');

incident.gQuery().gForEach(function(record) {
	gs.print(record.getValue('number'))
})

// Example #2: Getting a data set and creating an array of JSON strings

var incident = GRExtended('incident');

var mappedIncidents = incident.gQuery().gMap(function(record) {
	return record.gJson(); // Sets current record to a JSON strings
})

// Example #3: Filter to perform another query on the same table

var incident = GRExtended('incident');

var singleModificationRecords = incident.gQuery().gFilter(function(record) {
	return record.getValue('sys_mod_count') === '1';
}).gForEach(function(filteredRecord) {
	filteredRecord.setValue('description', 'this mod count was 1, it is now 2');
	filteredRecord.update();
})
