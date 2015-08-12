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

Planting.prototype.toggle_toolbox = function() {
    var that = this;
    return function() {
        that.toolbox.toggleClass('plantingjs-toolbox-hide');
        if (that.toolbox.hasClass('plantingjs-toolbox-hide')) {
            that.toggleToolbox.text('hide');
        } else {
            that.toggleToolbox.text('show');
        }
    };
};

Planting.prototype.start_planting = function () {
    var that = this;
    return function () {
        that.overlay.show();
        that.toolbox.show();
        $('.layers-menu').show();
        that.startBtn.hide();
        that.pano.setOptions({
            panControl: false,
            zoomControl: false,
            addressControl: false,
            linksControl: false
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
                var uiRotate = $('<span class="icon-loop" />');
                var uiRotateWrapper = $('<div class="wrapper-rotate" />')
                    .append('<span class="icon-menu-left" />')
                    .append('<span class="icon-menu-right" />')
                    .append(uiRotate);
                var tools = $('<div class="plantingjs-plantedobject-tools" />')
                    .append(uiTrash)
                    .append(uiResize)
                    .append(uiRotateWrapper);

                var container = $('<div class="plantingjs-plantedobject-container">')
                    .offset({ top: ui.offset.top, left: ui.offset.left})
                    .draggable({ cancel: ".icon-loop, .icon-trash, .icon-resize"})
                    .append(img)
                    .append(tools);

                that.overlay.append(container);


                var up = '<span class="plantingjs-layer-item-arrow" data-direction="up">UP</span>';
                var down = '<span class=".plantingjs-layer-item-down" data-direction="down">DOWN</span>';                
                var layerItem = $('<div class="plantingjs-layer-item" data-index="'+i+'">' + i + up + '<br/>'+ down + '</div>');
                that.layersMenu.append(layerItem);
               
                var plant = {
                    object: i,
                    projection: 0,
                    container: container,
                    tools: tools,
                    img: img
                };

                uiResize.on('mousedown', {plantedObject: plant}, that.resize_object);
                uiRotate.on('mousedown', {toolBoxObjects: that.toolboxobjects, plantedObject: plant}, that.rotate_object);
                uiTrash.on('click', {plantedObjectsArray: that.plantedobjects, plantedObject: plant}, that.remove_object);
                that.add_plant(plant);
                that.toolboxobjects[i].draggable.css({'top': '0px', 'left': '0px'});
            }
        }
    };
};

Planting.prototype.render_layers_tool = function() {
    /**
     * TODO
     */
};

Planting.prototype.change_layer_order = function(e){
    var self = $(e.target);
    var direction = self.data('direction');
    var currentIndex = self.parent().data('index');
    
    if(direction == 'up'){
        this.change_plant_index(currentIndex, currentIndex + 1);
    }
    else {
        this.change_plant_index(currentIndex, currentIndex - 1);
    }    
};

Planting.prototype.plantedobjects_modified = function() {
    this.update_plants_zIndex();
    this.render_layers_tool();
};

Planting.prototype.add_plant = function(plant) {
    this.plantedobjects.push(plant);
    this.plantedobjects_modified();
};

Planting.prototype.update_plants_zIndex = function() {
    if (!this.plantedobjects.length) {
        return;
    }

    this.plantedobjects.forEach(function(plant, index) {
        plant.container.css({ zIndex: index });
    });
};

Planting.prototype.change_plant_index = function (at, to) {
    while (at < 0) {
        at += this.plantedobjects.length;
    }
    while (to < 0) {
        to += this.plantedobjects.length;
    }
    this.plantedobjects.splice(to, 0, this.plantedobjects.splice(at, 1)[0]);

    this.plantedobjects_modified();
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

var EVENT_MOUSEDOWN = false;
var PROJECTION_LENGTH = 10;
Planting.prototype.rotate_object = function (e) {
    EVENT_MOUSEDOWN = true;
    $('body').addClass('noselect rotate');

    var plantedObject = e.data.plantedObject;
    var plantedObjectProjections = e.data.toolBoxObjects[plantedObject.object].projections;
    var newProjection = plantedObject.projection;
    var buttonX = $(this).offset().left;

    plantedObject.container.addClass('plantingjs-active-object');

    function rotateOnMove(e) {
        if (!EVENT_MOUSEDOWN) return;
        if (plantedObject.container.hasClass('plantingjs-active-object')) {
            var currentProjection = plantedObject.projection;
            var buttonCursorDistance = e.pageX - buttonX;

            var projectionsToRotate = (Math.abs(buttonCursorDistance) - Math.abs(buttonCursorDistance) % PROJECTION_LENGTH) / PROJECTION_LENGTH;
            projectionsToRotate %= plantedObjectProjections.length;
            if (buttonCursorDistance > 0) {
                currentProjection += projectionsToRotate;
                currentProjection %= plantedObjectProjections.length;
            } else if (buttonCursorDistance < 0) {
                if (currentProjection <= projectionsToRotate) {
                    currentProjection += plantedObjectProjections.length;
                }
                currentProjection -= projectionsToRotate;
                currentProjection--;
            }
            newProjection = currentProjection;
            plantedObject.img = plantedObject.img.attr('src', plantedObjectProjections[currentProjection]);
        }
    }

    function finishRotation(e) {
        if (EVENT_MOUSEDOWN && plantedObject.container.hasClass('plantingjs-active-object')) {
            $(document).off('mousemove', rotateOnMove);
            $(document).off('mouseup', finishRotation);
            plantedObject.projection = newProjection;
            $('body').removeClass('noselect rotate');
            plantedObject.container.removeClass('plantingjs-active-object');
            EVENT_MOUSEDOWN = false;
        }
    }

    $(document).on('mousemove', rotateOnMove);

    $(document).on('mouseup', finishRotation);
};

Planting.prototype.resize_object = function (e) {
    EVENT_MOUSEDOWN = true;
    $('body').addClass('noselect resize');
    var plantedObject = e.data.plantedObject,
        scale = plantedObject.scale || 1,
        cssScale,
        resizeOnDrag,
        finishResizing,
        buttonX = $(this).offset().left;
    var h = plantedObject.img.height();
    var w = plantedObject.img.width();

    plantedObject.container.addClass('plantingjs-active-object');

    resizeOnDrag = function (e) {
        if (!EVENT_MOUSEDOWN) return;
        if (plantedObject.container.hasClass('plantingjs-active-object')) {
            var buttonCursorDistance = buttonX - e.pageX;

            if (buttonCursorDistance === 0) {
                cssScale = scale;
            } else if (buttonCursorDistance < 0) {
                cssScale = scale - Math.abs(buttonCursorDistance / 100);
            } else if (buttonCursorDistance > 0) {
                cssScale = scale + buttonCursorDistance / 100;
            }

            if (cssScale > 0.2) {
                plantedObject.img.height(h * cssScale);
                plantedObject.img.width(w * cssScale);
            }
        }
    };
    finishResizing = function (e) {
        var plantedObjectContainer = plantedObject.container;
        if (EVENT_MOUSEDOWN && plantedObjectContainer.hasClass('plantingjs-active-object')) {
            $('body').removeClass('noselect resize');
            plantedObjectContainer.removeClass('plantingjs-active-object');
            $(document).off('mousemove', resizeOnDrag);
            $(document).off('mouseup', finishResizing);
            EVENT_MOUSEDOWN = false;
        }
    };

    $(document).on('mousemove', resizeOnDrag);
    $(document).on('mouseup', finishResizing);
};

Planting.prototype.remove_object = function (e) {
    plantedObjectsArray = e.data.plantedObjectsArray;
    plantedObject = e.data.plantedObject;
    var index = plantedObjectsArray.indexOf(plantedObject);
    plantedObjectsArray.splice(index, 1);
    $(this).closest('.plantingjs-plantedobject-container').remove();
    this.plantedobjects_modified();
};
