Planting.prototype.toggle_start_button = function () {
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
                    .draggable({ cancel: ".icon-loop, .icon-trash, .icon-resize"})
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

                uiResize.on('mousedown', {plantedObject: plant}, that.resize_object);
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

function calc_direction(objectPosition, mousePosition) {
    var calc = {};
    if (objectPosition <= mousePosition) {
        calc = {
            direction: true,
            mouseObjectDiff: mousePosition - objectPosition
        };
    } else if (objectPosition > mousePosition) {
        calc = {
            direction: false,
            mouseObjectDiff: objectPosition - mousePosition
        };
    }
    return calc;
}

function calc_sides(mouseObjectDiff, projectionsLength) {
    var sideLength = 20;
    var sides = (mouseObjectDiff - (mouseObjectDiff % sideLength)) / sideLength;
    if (sides >= projectionsLength) {
        sides = sides % projectionsLength;
    }
    return sides;
}

var rotateHelpers = {
    calc_direction: calc_direction,
    calc_sides: calc_sides
};


var EVENT_MOUSEDOWN = false;
Planting.prototype.rotate_object = function (e) {
    EVENT_MOUSEDOWN = true;
    $('body').addClass('noselect rotate');

    var plantedObject = e.data.plantedObject;
    var objectProjections = e.data.toolBoxObjects[plantedObject.object].projections;

    plantedObject.container.addClass('plantingjs-active-object');

    var projection;
    var buttonX = $(this).offset().left;

    function calc_projection(objectPosition, mousePosition) {
        var newProjection;
        var currentSide = plantedObject.projection;
        var direction = rotateHelpers.calc_direction(objectPosition, mousePosition);
        var numberOfSides = rotateHelpers.calc_sides(direction.mouseObjectDiff, objectProjections.length);

        currentSide++;
        if (direction.direction) {
            if ((currentSide + numberOfSides) > objectProjections.length) {
                newProjection = (currentSide + numberOfSides) % objectProjections.length;
            } else {
                newProjection = currentSide + numberOfSides;
            }
        } else {
            if (currentSide <= numberOfSides) {
                currentSide += objectProjections.length;
            }
            newProjection = currentSide - numberOfSides;
        }
        return --newProjection;
    }

    function rotateOnMove(e) {
        if (!EVENT_MOUSEDOWN) return;
        if (plantedObject.container.hasClass('plantingjs-active-object')) {
            projection = calc_projection(buttonX, e.pageX);
            plantedObject.img = plantedObject.img.attr('src', objectProjections[projection]);
        }
    }
    $(document).mousemove(rotateOnMove);

    $(document).mouseup(function(e) {
        var plantedObjectContainer = plantedObject.container;
        if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
            plantedObject.projection = projection;
            $('body').removeClass('noselect rotate');
            plantedObjectContainer.removeClass('plantingjs-active-object');
            EVENT_MOUSEDOWN = false;
        }
    });
};

// Planting.prototype.resize_object = function (e) {
//     EVENT_MOUSEDOWN = true;
//     $('body').addClass('noselect resize');
//     var plantedObject = e.data.plantedObject;
//     plantedObject.container.addClass('plantingjs-active-object');
//
//     buttonX = $(this).offset().left;
//
//     var resizeOnDrag = function(e) {
//         if (!EVENT_MOUSEDOWN) return;
//         if (plantedObject.container.hasClass('plantingjs-active-object')) {
//             buttonCursorDistance = buttonX - e.pageX;
//             if (buttonCursorDistance === 0) {
//                 scale = 1;
//             } else if (buttonCursorDistance < 0) {
//                 scale = 1 - Math.abs(buttonCursorDistance/100);
//             } else if (buttonCursorDistance > 0) {
//                 scale = 1 + buttonCursorDistance/100;
//             }
//             plantedObject.img = plantedObject.img.css('transform', 'scale(' + scale + ')');
//         }
//     };
//
//     $(document).on('mousemove', resizeOnDrag);
//
//     $(document).mouseup(function(e) {
//         var plantedObjectContainer = plantedObject.container;
//         if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
//             plantedObject.scale = scale;
//             $('body').removeClass('noselect resize');
//             plantedObjectContainer.removeClass('plantingjs-active-object');
//             EVENT_MOUSEDOWN = false;
//         }
//     });
// };

Planting.prototype.remove_object = function (e) {
    $(this).closest('.plantingjs-plantedobject-container').remove();
};
