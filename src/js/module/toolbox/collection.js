var Core = require('core');
var ToolboxModel = require('./model');

var ToolboxCollection = Core.Collection.extend({
    model: ToolboxModel
});
module.exports = ToolboxCollection;
