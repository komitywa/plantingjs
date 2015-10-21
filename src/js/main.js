var $ = require('jquery');
var Planting = require('planting');

// TODO: move this to index.html
function simple_save_callback(planting) {
    console.log(planting);
};

$(function() {
    PlantingInstance = new Planting( {
        container:document.querySelector('.viewport'),
        manifestoUrl: '/manifesto.json',
        googleApiKey: 'AIzaSyD9fmhpMCKGM6BCMtsnn05GfxEK77jRHjc',
        onSave: simple_save_callback
    });
});
