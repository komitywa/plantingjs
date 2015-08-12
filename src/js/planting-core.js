var Planting = {
    Main: {},
    Map: {},
    Object: {},
    Toolbox: {},
    Application: null,
    Mediator: _.clone(Backbone.Events),
    Event: {
        VISIBLE_CHANGED: 'visible_changed',
        START_PLANTING: 'start_planting',
        SAVE_REQUEST: 'save_request'
    }
};
var PlantingInstance = null;
