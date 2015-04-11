(function ($) {

    var plantingEngineList = [];
    $(window).resize(engine_resize);

    function createContainers(pe, div) {
        pe.container = div.first();
        pe.container
            .addClass("plantingjs-container")
            .empty()
            .append('<div class="plantingjs-proxy"></div>');
        pe.proxy = pe.container.find(".plantingjs-proxy");
        pe.proxy.append('<div class="plantingjs-startbtn">Start planting!</div>');
        pe.startBtn = pe.proxy.find(".plantingjs-startbtn");
        pe.proxy.append('<div class="plantingjs-toolbox"></div>');
        pe.toolbox = pe.proxy.find(".plantingjs-toolbox");
        pe.toolbox.append('<div class="plantingjs-savebtn">SAVE</div>');
        pe.saveBtn = pe.toolbox.find(".plantingjs-savebtn");
        pe.saveBtn.click(save(pe));
        pe.proxy.append('<div class="plantingjs-overlay"></div>');
        pe.overlay = pe.proxy.find(".plantingjs-overlay");
        pe.overlay.droppable({ drop: plant_object(pe), accept: ".plantingjs-toolboxobject-draggable"});
        pe.width = pe.overlay.width();
        pe.height = pe.overlay.height();
        pe.proxy.append('<div class="plantingjs-google"></div>');
        pe.google = pe.proxy.find(".plantingjs-google");
        pe.plantedobjects = [];
    }

    function initialazeMap(pe, lat, lng, zoom) {
        var mapOptions = {
            center: new google.maps.LatLng(lat, lng),
            zoom: zoom,
        };
        pe.map = new google.maps.Map(pe.google.get(0), mapOptions);
        pe.pano = pe.map.getStreetView();

        google.maps.event.addListener(pe.pano, 'visible_changed', toogle_start_button(pe));
        pe.startBtn.click(start_planting(pe));
    }

    function toogle_start_button(pe) {
        return function () {
            if (pe.pano.getVisible()) {
                pe.startBtn.show();
            } else {
                pe.startBtn.hide();
            }
        };
    }

    function start_planting(pe) {
        return function () {
            pe.overlay.show();
            pe.toolbox.show();
            pe.startBtn.hide();
            pe.pano.setOptions({
                panControl: false,
                zoomControl: false,
                addressControl: false,
                linksControl: false,
            });

        };
    }

    function rotate_object(e) {
        var plantedObject = e.data.plantedObject;
        var direction = e.data.direction;
        var toolBoxObjects = e.data.toolBoxObjects;

        var projections = toolBoxObjects[plantedObject.object].projections;

        if (direction === 'left') {
            if (plantedObject.projection === 0) {
                plantedObject.projection = projections.length;
            } else {
                plantedObject.projection -= 1;
            }
            plantedObject.img = plantedObject.img.attr('src', projections[plantedObject.projection]);
        } else if (direction === 'right') {
            if (plantedObject.projection === projections.length) {
                plantedObject.projection = 0;
            } else {
                plantedObject.projection += 1;
            }
        }
    }

    function plant_object(pe) {
        return function (e, ui) {
            for (var i = 0; i < pe.toolboxobjects.length; i++) {
                if (ui.draggable.is(pe.toolboxobjects[i].draggable)) {
                    var containerOffset = pe.container.offset();
                    var objectOffset = pe.toolboxobjects[i].draggable.offset();
                    var top = objectOffset.top - containerOffset.top;
                    var left = objectOffset.left - containerOffset.left;

                    var img = $('<img />').attr('src', pe.toolboxobjects[i].projections[0]);
                    var tools = $('<div class="plantingjs-plantedobject-tools" />');
                    tools.append('<div class="plantingjs-rotate"></div>');
                    tools.rotate = tools.find('.plantingjs-rotate');
                    tools.rotate.append('<div class="plantingjs-rotate-left"><</div>');
                    tools.rotate.left = tools.find('.plantingjs-rotate-left');
                    var container = $('<div class="plantingjs-plantedobject-container">')
                        .offset({ top: top, left: left})
                        .draggable()
                        .append(img)
                        .append(tools);
                    pe.overlay.append(container);
                    var plant = {
                        object: i,
                        projection: 0,
                        container: container,
                        tools: tools,
                        img: img,
                    }
                    tools.rotate.left.on('click', {toolBoxObjects: pe.toolboxobjects, plantedObject: plant, direction: 'left'}, rotate_object);
                    pe.plantedobjects.push(plant);
                    pe.toolboxobjects[i].draggable.css({'top': '0px', 'left': '0px'});
                }
            }
        };
    }

    function engine_resize() {
        for(var i = 0; i < plantingEngineList.length; i++) {
            var pe = plantingEngineList[i];
            var oldH = pe.height;
            var oldW = pe.width;
            var newH = pe.overlay.height();
            var newW = pe.overlay.width();
            var scale = newW / oldW;

            for(var j = 0; j < pe.plantedobjects.length; j++)
            {
                var h = pe.plantedobjects[j].img.height()
                var w = pe.plantedobjects[j].img.width();
                pe.plantedobjects[j].img.height(h * scale);
                pe.plantedobjects[j].img.width(w * scale);

                var pos = pe.plantedobjects[j].container.position();
                var t = pos.top;
                var l = pos.left;
                l = l * scale;
                t = newH / 2 + (t - oldH / 2) * scale;
                pe.plantedobjects[j].container.css({ top: t, left: l});
            }

            pe.height = newH;
            pe.width = newW;
        }
    }

    function save(pe) {
        return function () {
            var position = pe.pano.getPosition();
            var pov = pe.pano.getPov();
            var save_json = {
                manifesto: pe.manifesto,
                lat: position.lat(),
                lng: position.lng(),
                heading: pov.heading,
                pitch: pov.pitch,
                zoom: pe.pano.getZoom(),
                objects: []
            };
            for (var i = 0; i < pe.plantedobjects.length; i++) {
                position = pe.plantedobjects[i].container.position();
                save_json.objects.push({
                    object: pe.plantedobjects[i].object,
                    projection: pe.plantedobjects[i].projection,
                    width: pe.plantedobjects[i].img.width()/pe.width,
                    position: {
                        x: position.left / pe.width,
                        y: (position.top - pe.height / 2) / pe.width
                    }
                });
            }
            console.log(JSON.stringify(save_json));
        };
    }

    function download_toolbox(pe) {
        for (var i = 0; i < pe.toolboxobjects.length; i++) {
            pe.toolbox.append('<div class="plantingjs-toolboxobject-container">' +
                '<div class="plantingjs-toolboxobject-prototype"></div>' +
                '<div class="plantingjs-toolboxobject-draggable"></div>' +
                '</div>');
            var container = pe.toolbox.find('.plantingjs-toolboxobject-container').last();
            var prototype = container.find('.plantingjs-toolboxobject-prototype');
            var draggable = container.find('.plantingjs-toolboxobject-draggable');
            var img = $('<img />').attr('src', pe.toolboxobjects[i].projections[0]);
            prototype.append(img.clone());
            draggable.append(img).draggable({ containment: ".plantingjs-overlay" });
            pe.toolboxobjects[i].container = container;
            pe.toolboxobjects[i].draggable = draggable;
        }

        for (var i = 0; i < pe.toolboxobjects.length; i++) {
            for (var j = 0; j < 36; j++) {
                var img = $('<img />').attr('src', pe.toolboxobjects[i].projections[j]);
            }
        }
    }

    function download_manifesto(pe) {
        return function (data) {
            pe.lat = data.lat;
            pe.lng = data.lng;
            pe.zoom = data.zoom;
            pe.toolboxobjects = data.toolboxobjects;
            initialazeMap(pe, pe.lat, pe.lng, pe.zoom);
            download_toolbox(pe);
        };
    }

    function plant_objects_for_view(pe) {
        return function (data) {
            for (var i = 0; i < pe.plantedobjects.length; i++) {
                pe.plantedobjects[i].url = data.toolboxobjects[pe.plantedobjects[i].object].projections[pe.plantedobjects[i].projection];
                var img = $('<img />')
                    .attr('src', pe.plantedobjects[i].url);
                var containerOffset = pe.container.offset();
                var div = $('<div class="plantingjs-plantedobject-container" />')
                    .offset({
                        left: containerOffset.left + pe.plantedobjects[i].position.x * pe.width,
                        top: containerOffset.top + pe.height / 2 + pe.plantedobjects[i].position.y * pe.width
                    });
                div.append(img);
                pe.overlay.append(div);
                pe.plantedobjects[i].img = img;
                pe.plantedobjects[i].container = div;
            }
        }
    }

    function download_view(pe) {
        return function (data) {
            pe.manifesto = data.manifesto;
            pe.lat = data.lat;
            pe.lng = data.lng;
            pe.heading = data.heading;
            pe.pitch = data.pitch;
            pe.zoom = data.zoom;
            pe.plantedobjects = data.objects;
            var panoOptions = {
                position: {lat: pe.lat, lng: pe.lng},
                pov: {heading: pe.heading, pitch: pe.pitch, zoom: pe.zoom},
                panControl: false,
                zoomControl: false,
                addressControl: false,
                linksControl: false
            };
            pe.pano = new  google.maps.StreetViewPanorama(pe.google.get(0), panoOptions);
            $.getJSON(pe.manifesto).done(plant_objects_for_view(pe));
        }
    }

    function FromMap(div, manifesto) {
        this.manifesto = manifesto;
        createContainers(this, div);
        $.getJSON(this.manifesto).done(download_manifesto(this));
    }

    function FromStreetView(div, manifesto) {
        createContainers(this, div);
    }

    function Viewer(div, manifesto) {
        this.view = manifesto;
        createContainers(this, div);
        this.overlay
            .droppable("disable")
            .show();
        $.getJSON(this.view).done(download_view(this));
    }

    PlantingJS = {

        fromMap: function (div, manifesto) {
            var pe = new FromMap(div, manifesto);
            plantingEngineList.push(pe);
            return pe;
        },

        fromStreetView: function (div, manifesto) {
            var pe = new FromStreetView(div, manifesto);
            plantingEngineList.push(pe);
            return pe;
        },

        viewer: function (div, manifesto) {
            var pe = new Viewer(div, manifesto);
            plantingEngineList.push(pe);
            return pe;
        },

    };

}) (jQuery);
