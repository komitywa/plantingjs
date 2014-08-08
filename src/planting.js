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
        pe.overlay = pe.proxy.find(".plantingjs-proxy");
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

        var toogle_start_button = (function (pe) {
            return function () {
                if (pe.pano.getVisible()) {
                    pe.startBtn.show();
                } else {
                    pe.startBtn.hide();
                }
            }
        }) (pe);

        google.maps.event.addListener(pe.pano, 'visible_changed', toogle_start_button);
    }

    function FromMap(values) {
        createContainers(this, values.div);
        initialazeMap(this, values.lat, values.lng, values.zoom);
    }

    function FromStreetView(values) {
        createContainers(this, values.div);
    }

    function Viewer(values) {
        createContainers(this, values.div);
        
    }

    PlantingJS = {

        fromMap: function (values) {
            var pe = new FromMap(values);
            plantingEngineList.push(pe);
            return pe;
        },

        fromStreetView: function (values) {
            var pe = new FromStreetView(values);
            plantingEngineList.push(pe);
            return pe;
        },

        viewer: function (values) {
            var pe = new Viewer(values);
            plantingEngineList.push(pe);
            return pe;
        },

    };

}) (jQuery);
