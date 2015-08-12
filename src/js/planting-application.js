Planting.Application = function( args ) {
    var DOMReady = $.Deferred();
    var MapsLoader = $.Deferred();
    var googleApiUrl = 'https://maps.googleapis.com/maps/api/js?key=' + args.googleApiKey;
    this.container = args.container;

    $(function() { DOMReady.resolve(); });
    $.getScript('https://www.google.com/jsapi')
        .then(function() {
            google.load('maps', '3', {
                other_params: 'key=' + args.googleApiKey, 
                callback: MapsLoader.resolve.bind(MapsLoader)
            });
        });
    $.when( $.getJSON(args.manifestoUrl), MapsLoader, DOMReady )
        .done(this.initialize.bind(this));
};

Planting.Application.prototype.initialize = function( manifestoRequest ) {
    this.manifesto = manifestoRequest[0];
    this.main = new Planting.Main.MainView({
        el: this.container,
        manifesto: this.manifesto
    });
};

PlantingInstance = new Planting.Application( {
    container:document.querySelector('.viewport'), 
    manifestoUrl: '/manifesto.json',
    googleApiKey: 'AIzaSyD9fmhpMCKGM6BCMtsnn05GfxEK77jRHjc' 
});
