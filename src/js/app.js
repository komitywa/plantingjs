function Planting(args) {
    var Core = Planting.module('core');
    var PlantingData = Planting.module('plantingData');
    var MapsLoader = $.Deferred();
    var googleApiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + args.googleApiKey;

    this.container = args.container;
    this.data = {
        planting: new PlantingData.Model(),
        manifesto: null
    };
    this._initializeEventEmmiter();
    $.getScript('https://www.google.com/jsapi')
        .then(function() {
            google.load('maps', '3', {
                other_params: 'key=' + args.googleApiKey, 
                callback: MapsLoader.resolve.bind(MapsLoader)
            });
        });
    $.when( $.getJSON(args.manifestoUrl), MapsLoader )
        .then(function(manifestoResult) {
            this.data.manifesto = new Backbone.Model(manifestoResult[0]);
        }.bind(this))
        .done(this._initializeViews.bind(this));
};

Planting.prototype._initializeEventEmmiter = function() {
    _.extend(this, _.clone(Backbone.Events));
};

Planting.prototype._initializeViews = function() {
    var Main = Planting.module('main');
    var Plant = Planting.module('plant');
    var Toolbox = Planting.module('toolbox');
    var Map = Planting.module('map');
    var LayersManager = Planting.module('layersManager');

    this.main = new Main.View.Main({
        el: this.container,
        manifesto: this.data.manifesto.toJSON(),
        app: this
    });
    this.overlay = new Plant.View.Overlay({
        el: this.main.el.querySelector('.plantingjs-overlay'),
        app: this
    });
    this.toolbox = new Toolbox.View.Sidebar({
        el: this.main.el.querySelector('.plantingjs-toolbox'),
        manifesto: this.data.manifesto.toJSON(),
        app: this
    });
    this.map = new Map.View({
        el: this.main.el.querySelector('.plantingjs-google'),
        map: {
            lat: this.data.manifesto.get('lat'),
            lng: this.data.manifesto.get('lng'),
            zoom: this.data.manifesto.get('zoom')
        },
        app: this
    });
    this.layersManager = new LayersManager.View.Menu({
        $parent: this.main.$proxy,
        collection: this.data.plantedObjects,
        app: this
    });
    
};

_.extend(Planting, {
    module: function() {
        var _modules = {};

        return function(name) {
            name = name.toUpperCase();

            if (_modules[name]) {
                return _modules[name];
            }

            return _modules[name] = {
                Model: {},
                Collection: {},
                View: {}
            };
        };
    }(),

    Event: {
        VISIBLE_CHANGED: 'visible_changed',
        START_PLANTING: 'start_planting',
        SAVE_REQUEST: 'save_request'
    }
});

$(function() {
    PlantingInstance = new Planting( {
        container:document.querySelector('.viewport'), 
        manifestoUrl: '/manifesto.json',
        googleApiKey: 'AIzaSyD9fmhpMCKGM6BCMtsnn05GfxEK77jRHjc' 
    });
});
