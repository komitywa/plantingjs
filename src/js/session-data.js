var _ = require('underscore');
var Core = require('core');
var Const = require('const');
var PlantCollection = require('module/plant/collection');

var SessionDataModel = Core.Model.extend({

    ignoreObjectValues: [
        'userActivity',
        'projections'
    ],
    defaults: {
        lat: null,
        lng: null,
        zoom: null,
        heading: null,
        pitch: 0
    },

    _objectsCollection: null,

    constructor: function(data, options) {

        this._objectsCollection = new PlantCollection(null, {
            app: options.app
        });
        Core.Model.call(this, data, options);
    },

    objects: function() {

        return this._objectsCollection;
    },

    setPanoCoords: function(data) {

        this.set(data);
    },

    toJSON: function() {
        var objects = this.objects().toJSON();

        return _.extend(Core.Model.prototype.toJSON.call(this), {
            objects: _.omit(objects, this.ignoreObjectValues)
        });
    },

    save: function() {
        var data = this.toJSON();

        this.app.trigger(Const.Event.SAVE_REQUEST, data);

        if (_.isFunction(this.app.options.onSave)) {

            this.app.options.onSave.call(this, data);
        }
    }
});
module.exports = SessionDataModel;
