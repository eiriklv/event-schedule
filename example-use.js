var debug = require('debug')('schedule-app');
var eventSchedule = require('./event-schedule');

eventSchedule.at('19:00:30', function(time) {
    debug('my first custom event is firing at ' + time + '!');
}, function(err, id) {
    if (err) return debug('could not set first timed event');
    debug('successfully set first timed event - id: ' + id);

    // id can be used to remove listener
    //eventSchedule.removeListener(id);
});

eventSchedule.at('19:01', function(time) {
    // 
    debug('my second custom event is firing at ' + time + '!');
}, function(err, id) {
    if (err) return debug('could not set first timed event');
    debug('successfully set second timed event - id: ' + id);

    // id can be used to remove listener
    //eventSchedule.removeListener(id);
});
