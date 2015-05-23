Planting.prototype.save = function (pe) {
    var that = this;
    return function () {
        var position = that.pano.getPosition();
        var pov = that.pano.getPov();
        var save_json = {
            manifesto: that.manifesto,
            lat: position.lat(),
            lng: position.lng(),
            heading: pov.heading,
            pitch: pov.pitch,
            zoom: that.pano.getZoom(),
            objects: []
        };
        for (var i = 0; i < that.plantedobjects.length; i++) {
            position = that.plantedobjects[i].container.position();
            save_json.objects.push({
                object: that.plantedobjects[i].object,
                projection: that.plantedobjects[i].projection,
                width: that.plantedobjects[i].img.width()/pe.width,
                position: {
                    x: position.left / that.width,
                    y: (position.top - that.height / 2) / that.width
                }
            });
        }
        that.save_callback(save_json);
    };
};
