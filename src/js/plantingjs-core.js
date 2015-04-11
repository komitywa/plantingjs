function PlantingJS () {
    var that = this;

    this.plantingEngineList = [];
    $(window).resize(engine_resize);

    function engine_resize () {
        for(var i = 0; i < that.plantingEngineList.length; i++) {
            var pe = that.plantingEngineList[i];
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
};

PlantingJS.prototype.initFromMap = function (div, manifesto, save_callback) {
    var pe = new Planting(div, save_callback);
    this.plantingEngineList.push(pe);
    $.getJSON(manifesto).done(pe.download_manifesto(this));
    return pe;
};

PlantingJS.prototype.initFromStreetView = function (div, manifesto, save_callback) {
    var pe = new Planting(div);
    this.plantingEngineList.push(pe);
    return pe;
};

PlantingJS.prototype.initViewer = function (div, manifesto) {
    var pe = new Planting(div);
    this.plantingEngineList.push(pe);
    pe.overlay
        .droppable("disable")
        .show();
    $.getJSON(manifesto).done(pe.download_view(this));
    return pe;
};
