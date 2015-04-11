Planting.prototype.toogle_start_button = function () {
    var that = this;
    return function () {
        if (that.pano.getVisible()) {
            that.startBtn.show();
        } else {
            that.startBtn.hide();
        }
    };
};

Planting.prototype.start_planting = function () {
    var that = this;
    return function () {
        that.overlay.show();
        that.toolbox.show();
        that.startBtn.hide();
        that.pano.setOptions({
            panControl: false,
            zoomControl: false,
            addressControl: false,
            linksControl: false,
        });

    };
};

Planting.prototype.plant_object = function () {
    var that = this;
    return function (e, ui) {
        for (var i = 0; i < that.toolboxobjects.length; i++) {
            if (ui.draggable.is(that.toolboxobjects[i].draggable)) {

                var containerOffset = that.container.offset();
                var objectOffset = that.toolboxobjects[i].draggable.offset();
                var top = objectOffset.top - containerOffset.top;
                var left = objectOffset.left - containerOffset.left;

                var img = $('<img />').attr('src', that.toolboxobjects[i].projections[0]);
                var uiTrash = $('<span class="icon-trash" />');
                var uiResize = $('<span class="icon-resize" />');
                var uiRefresh = $('<span class="icon-loop" />')
                    .append('<span class="icon-menu-left" />')
                    .append('<span class="degrees">0&deg;</span>')
                    .append('<span class="icon-menu-right" />');
                var tools = $('<div class="plantingjs-plantedobject-tools" />')
                    .append(uiTrash)
                    .append(uiResize)
                    .append(uiRefresh)
                    .append('<div class="plantingjs-rotate"></div>');

                tools.rotate = tools.find('.plantingjs-rotate');
                tools.rotate.append('<div class="plantingjs-rotate-left"></div>');
                tools.rotate.left = tools.find('.plantingjs-rotate-left');

                var container = $('<div class="plantingjs-plantedobject-container">')
                    .offset({ top: top, left: left})
                    .draggable()
                    .append(img)
                    .append(tools);

                that.overlay.append(container);

                var plant = {
                    object: i,
                    projection: 0,
                    container: container,
                    tools: tools,
                    img: img,
                }

                uiRefresh.on('click', {toolBoxObjects: that.toolboxobjects, plantedObject: plant, direction: 'left'}, that.rotate_object);
                that.plantedobjects.push(plant);
                that.toolboxobjects[i].draggable.css({'top': '0px', 'left': '0px'});
            }
        }
    };
};

Planting.prototype.plant_objects_for_view = function () {
    var that = this;
    return function (data) {
        for (var i = 0; i < that.plantedobjects.length; i++) {
            that.plantedobjects[i].url = data.toolboxobjects[that.plantedobjects[i].object].projections[that.plantedobjects[i].projection];
            var img = $('<img />')
                .attr('src', that.plantedobjects[i].url);
            var containerOffset = that.container.offset();
            var div = $('<div class="plantingjs-plantedobject-container" />')
                .offset({
                    left: containerOffset.left + that.plantedobjects[i].position.x * that.width,
                    top: containerOffset.top + that.height / 2 + that.plantedobjects[i].position.y * that.width
                });
            div.append(img);
            that.overlay.append(div);
            that.plantedobjects[i].img = img;
            that.plantedobjects[i].container = div;
        }
    }
};

Planting.prototype.rotate_object = function (e) {
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
};
