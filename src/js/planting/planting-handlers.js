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
                var uiRefresh = $('<span class="icon-loop" />');
                var tools = $('<div class="plantingjs-plantedobject-tools" />')
                    .append(uiTrash)
                    .append(uiResize)
                    .append(uiRefresh);

                var container = $('<div class="plantingjs-plantedobject-container">')
                    .offset({ top: ui.offset.top, left: ui.offset.left})
                    .draggable({ cancel: ".icon-loop"})
                    .append(img)
                    .append(tools);

                that.overlay.append(container);

                var plant = {
                    object: i,
                    projection: 0,
                    container: container,
                    tools: tools,
                    img: img,
                };

                uiRefresh.on('mousedown', {toolBoxObjects: that.toolboxobjects, plantedObject: plant}, that.rotate_object);
                uiTrash.on('click', that.remove_object);
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
    };
};

var calc_direction = function calc_direction(objectPosition, mousePosition) {
    var calc = {};

    if (objectPosition < mousePosition) {
        calc.direction = "ASC";
        calc.width = mousePosition - objectPosition;
    } else if (objectPosition > mousePosition) {
        calc.direction = "DSC";
        calc.width = objectPosition - mousePosition;
    }

    return calc;
};

var isDown = false;
Planting.prototype.rotate_object = function (e) {
    isDown = true;
    $('body').addClass('noselect rotate');

    var plantedObject = e.data.plantedObject;
    var projections = e.data.toolBoxObjects[plantedObject.object].projections;

    var side_width = 20;
    var projection;

    buttonX = $(this).offset().left;
    currentProjection = plantedObject.projection;

    var calc_projection = function calc_projection(objectPosition, mousePosition) {
        var rotate = calc_direction(objectPosition, mousePosition);
        rotate.current = currentProjection;
        rotate.current++;
        rotate.sides = (rotate.width - (rotate.width % side_width)) / side_width;
        if (rotate.sides >= projections.length) {
            rotate.sides = rotate.sides % projections.length;
        }
        if (rotate.direction === "ASC") {
            if ((rotate.current + rotate.sides) > projections.length) {
                rotate.projection = (rotate.current + rotate.sides) % projections.length;
            } else {
                rotate.projection = rotate.current + rotate.sides;
            }
        } else if (rotate.direction === "DSC") {
            if (rotate.current <= rotate.sides) {
                rotate.current += projections.length;
            }
            rotate.projection = rotate.current - rotate.sides;
        }
        return --rotate.projection;
    };

    $(document).mousemove(function(e) {
        if (!isDown) return;
        projection = calc_projection(buttonX, e.pageX);

        plantedObject.img = plantedObject.img.attr('src', projections[projection]);
    });

    $(document).mouseup(function(e) {
        if (isDown) {
            plantedObject.projection = projection;
            $('body').removeClass('noselect rotate');
            isDown = false;
        }
    });
};

Planting.prototype.remove_object = function (e) {
    $(this).closest('.plantingjs-plantedobject-container').remove();
};
