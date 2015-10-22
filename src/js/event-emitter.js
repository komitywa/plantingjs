var _ = require('underscore');
var EventEmitter = _.clone(require('backbone').Events);

module.exports = function(host) {

    return _.clone(EventEmitter);
};
