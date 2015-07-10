function Planting(div, manifesto, save_callback) {
    this.manifesto = manifesto;
    this.save_callback = save_callback;
    this.container = div.first();
    this.container
        .addClass("plantingjs-container")
        .empty()
        .append('<div class="plantingjs-proxy"></div>');
    this.proxy = this.container.find(".plantingjs-proxy");
    this.proxy.append('<div class="plantingjs-startbtn"><span class="icon-menu-hamburger"></span> Start planting!</div>');
    this.startBtn = this.proxy.find(".plantingjs-startbtn");
    this.proxy.append('<div class="layers-menu"></div>');
    this.proxy.append('<div class="plantingjs-toolbox"></div>');
    this.toolbox = this.proxy.find(".plantingjs-toolbox");
    this.toolbox.append('<div class="plantingjs-savebtn">SAVE</div>');
    this.saveBtn = this.toolbox.find(".plantingjs-savebtn");
    this.saveBtn.click(this.save(this));
    this.proxy.append('<div class="plantingjs-overlay"></div>');
    this.overlay = this.proxy.find(".plantingjs-overlay");
    this.overlay.droppable({ drop: this.plant_object(this), accept: ".plantingjs-toolboxobject-draggable"});
    this.width = this.overlay.width();
    this.height = this.overlay.height();
    this.proxy.append('<div class="plantingjs-google"></div>');
    this.google = this.proxy.find(".plantingjs-google");
    this.plantedobjects = [];
};

Planting.prototype.initialazeMap = function (lat, lng, zoom) {
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: zoom,
    };
    this.map = new google.maps.Map(this.google.get(0), mapOptions);
    this.pano = this.map.getStreetView();

    google.maps.event.addListener(this.pano, 'visible_changed', this.toggle_start_button(this));
    this.startBtn.click(this.start_planting());
};
