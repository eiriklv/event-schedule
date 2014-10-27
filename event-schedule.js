var debug = require('debug')('eventclock');
var moment = require('moment');
var async = require('async');
var colors = require('colors');
if (!setImmediate) require('setimmediate');

var validFormats = [
    (new RegExp(/^([0-9]{2})\:([0-9]{2})$/)),
    (new RegExp(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/))
];

function EventSchedule() {
    this.count = 0;
    this.eventList = {};
    this.timer = setInterval(this.tick.bind(this), 1000);
    debug('instance created');
}

EventSchedule.prototype.at = function(time, handler, callback) {
    debug('trying to register event for: ' + time);
    time = this.parseInput(time);

    if (!time) return callback ? callback('EventSchedule - Wrong Format: Use HH:mm:ss or HH:mm for short') : null;
    if (!this.eventList[time]) this.eventList[time] = [];

    var eventObject = {
        id: time + '#' + this.count++,
        handler: handler
    };

    this.eventList[time].push(eventObject);
    callback(null, eventObject.id);
};

EventSchedule.prototype.tick = function() {
    var now = moment().format('HH:mm:ss');
    debug(now);
    this.executeListeners(now);
};

EventSchedule.prototype.parseInput = function(input) {
    var valid = validFormats
        .map(function(regex) {
            return regex.test(input);
        })
        .reduce(function(a, b) {
            return a || b;
        });

    var parsedTime = moment(input, 'HH:mm:ss').format('HH:mm:ss')
    return valid && parsedTime != 'Invalid date' ? parsedTime : null;
};

EventSchedule.prototype.executeListeners = function(time) {
    if (!this.eventList[time]) return;

    async.each(this.eventList[time], function(item, callback) {
        setImmediate(function() {
            debug('executing event with id' + item.id + ' at: ' + time);
            item.handler(time);
            callback();
        }.bind(this));
    }.bind(this), function(err) {
        if (err) debug('could not execute callbacks for listeners - ', err);
        debug('done calling back to listeners for event: '.green + time);
    })
};

EventSchedule.prototype.removeListener = function(id) {
    var parsedId = id.split('#');
    if (!this.eventList[parsedId[0]]) return;

    this.eventList[parsedId[0]].forEach(function(item, index, array) {
        if (item.id == id) {
            array.splice(index, 1);
            debug('removed ' + id);
        }
    }.bind(this));

    if (!this.eventList[parsedId[0]].length) this.eventList[parsedId[0]] = null;
};

module.exports = new EventSchedule();
