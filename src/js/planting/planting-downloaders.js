Planting.prototype.download_toolbox = function () {
    for (var i = 0; i < this.toolboxobjects.length; i++) {
        this.toolbox.append('<div class="plantingjs-toolboxobject-container">' +
            '<div class="plantingjs-toolboxobject-prototype"></div>' +
            '<div class="plantingjs-toolboxobject-draggable"></div>' +
            '</div>');
        var container = this.toolbox.find('.plantingjs-toolboxobject-container').last();
        var prototype = container.find('.plantingjs-toolboxobject-prototype');
        var draggable = container.find('.plantingjs-toolboxobject-draggable');
        var img = $('<img />').attr('src', this.toolboxobjects[i].projections[0]);
        prototype.append(img.clone());
        draggable.append(img).draggable({ containment: ".plantingjs-overlay" });
        this.toolboxobjects[i].container = container;
        this.toolboxobjects[i].draggable = draggable;
    }

    for (var i = 0; i < this.toolboxobjects.length; i++) {
        for (var j = 0; j < 36; j++) {
            var img = $('<img />').attr('src', this.toolboxobjects[i].projections[j]);
        }
    }
};

Planting.prototype.download_manifesto = function () {
    var that = this;
    return function (data) {
        that.lat = data.lat;
        that.lng = data.lng;
        that.zoom = data.zoom;
        that.toolboxobjects = data.toolboxobjects;
        that.initialazeMap(that.lat, that.lng, that.zoom);
        that.download_toolbox(that);
    };
};

Planting.prototype.download_view = function () {
    var that = this;
    return function (data) {
        that.manifesto = data.manifesto;
        that.lat = data.lat;
        that.lng = data.lng;
        that.heading = data.heading;
        that.pitch = data.pitch;
        that.zoom = data.zoom;
        that.plantedobjects = data.objects;
        var panoOptions = {
            position: {lat: that.lat, lng: that.lng},
            pov: {heading: that.heading, pitch: that.pitch, zoom: that.zoom},
            panControl: false,
            zoomControl: false,
            addressControl: false,
            linksControl: false
        };
        this.pano = new  google.maps.StreetViewPanorama(that.google.get(0), panoOptions);
        $.getJSON(that.manifesto).done(that.plant_objects_for_view());
    }
};
