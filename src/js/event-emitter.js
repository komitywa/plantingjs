var _ = require('underscore');
var EventEmitter = require('backbone').Events;

module.exports = function(host) {

    return _.clone(EventEmitter);
};
