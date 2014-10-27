Event Schedule
===================================

#### Introduction:
Create time scheduled event callbacks

#### Example use:
```js
var eventSchedule = require('event-schedule');

eventSchedule.at('19:00:30', function(time) {
    // this will fire at 19:00:30 system time
}, function(err, id) {
    if (!err) {
        // gives you an id that can be used to remove the listener at a later point
        //eventSchedule.removeListener(id);
    }
});

eventSchedule.at('19:01', function(time) {
    // this will fire at 19:01:00 system time
}, function(err, id) {
    if (!err) {
        // gives you an id that can be used to remove the listener at a later point
        //eventSchedule.removeListener(id);
    }
});
```
