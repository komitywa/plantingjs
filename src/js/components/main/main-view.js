Planting.Main.MainView = Backbone.View.extend({
    toolbox: null, 
    map: null,
    className: 'plantingjs-container',
    template: _.template('\
        <div class="plantingjs-proxy">\
            <div class="plantingjs-startbtn">\
                <span class="icon-menu-hamburger"></span>\
                 Start planting!\
            </div>\
            <div class="layers-menu"></div>\
            <div class="plantingjs-toolbox"></div>\
            <div class="plantingjs-google"></div>\
        </div>\
    '),
    events: {
        'click .plantingjs-startbtn': 'startPlanting'
    },

    initialize: function(opts) {

        this.overlay = new Planting.Main.MainOverlayView({ 
            collection: new Planting.Object.ObjectsCollection(),
            parent: this });
        this.render();
        this.toolbox = new Planting.Toolbox.ToolboxObjectsView({
            collection: new Planting.Object.ObjectsCollection(opts.manifesto.toolboxobjects),
            el: this.el.querySelector('.plantingjs-toolbox')
        });
        this.map = new Planting.Map.MapView({
            el: this.el.querySelector('.plantingjs-google'),
            map: {
                lat: opts.manifesto.lat,
                lng: opts.manifesto.lng,
                zoom: opts.manifesto.zoom
            }
        });

        Planting.Mediator
            .on(Planting.Event.VISIBLE_CHANGED, function(visible) {
                this.$el.find('.plantingjs-startbtn').toggle(visible);
            }, this)
            .on(Planting.Event.START_PLANTING, function() {
                this.$el.find('.plantingjs-startbtn').hide();
            }, this);      
    },

    render: function() {

        this.$el.html(this.template());
        $(this.overlay.$el).insertBefore('.plantingjs-google');
    },

    startPlanting: function() {
        
        Planting.Mediator.trigger(Planting.Event.START_PLANTING);
    }
});
