import $ from 'jquery';
import _ from 'underscore';
import Backbone from 'backbone';
import EventEmitter from 'event-emitter';
import Const from 'const';
import SessionDataModel from 'session-data';
import ManifestoDataModel from 'manifesto-data';
import Main from 'module/main/main';
import Plant from 'module/plant/plant';
import Toolbox from 'module/toolbox/toolbox';
import Map from 'module/map/map';
import LayersManager from 'module/layers-manager/layers-manager';

export default class extends EventEmitter {

    constructor(options) {
        var initDefer = $.Deferred();
        
        super(options);

        this.options = options;
        this._initializeHelpers();
        this.data = {
            session: new SessionDataModel(null, {
                app: this
            }),
            manifesto: new ManifestoDataModel(null, {
                url: options.manifestoUrl,
                app: this
            })
        };
        this.setState(Const.State.INITING);
        this.manifesto()
            .fetch()
            .done(function() {
                this._initializeViews();
                initDefer.resolve();
            }.bind(this));
        this.initDefer = initDefer.promise();
    }

    _initializeHelpers() {
        _.extend(this, {
            _state: null,

            session: function() {

                return this.data.session;
            },
            manifesto: function() {

                return this.data.manifesto;
            },

            setState: function(state) {
                var prevState = this._state;
                
                this._state = state;
                this.trigger(Const.Event.STATE_CHANGED, this._state, prevState);

                return this;
            },

            getState: function() {

                return this._state;
            }
        });
    }
    
    _initializeViews() {

        this.main = new Main.View.Main({
            el: this.options.container,
            manifesto: this.manifesto().toJSON(),
            app: this
        });
        this.overlay = new Plant.View.Overlay({
            el: this.main.el.querySelector('.plantingjs-overlay'),
            collection: this.session().objects(),
            app: this
        });
        this.toolbox = new Toolbox.View.Sidebar({
            el: this.main.el.querySelector('.plantingjs-toolbox'),
            app: this
        });
        this.map = new Map.View({
            el: this.main.el.querySelector('.plantingjs-google'),
            model: this.manifesto(),
            app: this
        });
        this.layersManager = new LayersManager.View.Menu({
            $parent: this.main.$proxy,
            collection: this.session().objects(),
            app: this
        });
    };
    
    initPlant(objects) {
        this.main.dialog.close();
        _.each(objects, function(object) {

            this.session().objects().add(object, {
                parse: true,
                app: this
            });
        }, this);
    }

    initViewer(options) {
        var panoOptions = {
            position: {
                lat: options.lat,
                lng: options.lng
            },
            pov: {
                heading: options.heading,
                pitch: options.pitch,
                zoom: options.zoom
            }
        };
        var objects = options.objects;

        this.initDefer
            .then(function() {

                this.setState(Const.State.VIEWER);
                this.map.initializeViewer(panoOptions);

                if (objects &&
                    objects.length) {

                    this.initPlant(objects);
                }
            }.bind(this));
    };
}
