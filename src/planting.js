(function ($) {

    var plantingEngineList = [];

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
        pe.proxy.append('<div class="plantingjs-overlay"></div>');
        pe.overlay = pe.proxy.find(".plantingjs-overlay");
        pe.overlay.droppable({ drop: plant_object(pe), accept: ".plantingjs-toolboxobject-draggable"});
        pe.proxy.append('<div class="plantingjs-google"></div>');
        pe.google = pe.proxy.find(".plantingjs-google");
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

    function plant_object(pe) {
        return function (e, ui) {
            for (var i = 0; i < pe.toolboxobjects.length; i++) {
                if (ui.draggable.is(pe.toolboxobjects[i].draggable)) {
                    pe.toolboxobjects[i].draggable.css({'top': '0px', 'left': '0px'});
                }
            }
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

    function FromMap(div, manifesto) {
        this.manifesto = manifesto;
        createContainers(this, div);
        $.getJSON(this.manifesto).done(download_manifesto(this));
    }

    function FromStreetView(div, manifesto) {
        createContainers(this, div);
    }

    function Viewer(div, manifesto) {
        createContainers(this, div);
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
