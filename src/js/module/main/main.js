var _ = require('underscore');
var Core = require('core');
var MainViewDialog = require('module/main/dialog');
var Const = require('const');

var MainViewMain = Core.View.extend({
    toolbox: null,
    map: null,
    className: 'plantingjs-container',
    template: _.template('\
        <div class="plantingjs-proxy">\
            <div class="plantingjs-startbtn">\
                <span class="icon-menu-hamburger"></span>\
                 Start planting!\
            </div>\
            <div class="layers-menu"></div>\
            <div class="plantingjs-toolbox"></div>\
            <div class="plantingjs-overlay ui-droppable"></div>\
            <div class="plantingjs-google"></div>\
            <div class="plantingjs-dialog"></div>\
        </div>\
    '),
    events: {
        'click .plantingjs-startbtn': 'startPlanting'
    },

    $proxy: null,

    initialize: function(opts) {
        this.render();
        this.$proxy = this.$el.children();
        this.dialog = new MainViewDialog({
            el: this.el.querySelector('.plantingjs-dialog'),
            app: this.app
        });
        this.app
            .on(Const.Event.VISIBLE_CHANGED, function(visible) {

                if(this.app.getState() !== Const.State.VIEWER) {

                    this.$el.find('.plantingjs-startbtn').toggle(visible);
                }
            }, this)
            .on(Const.Event.START_PLANTING, function() {
                this.$el.find('.plantingjs-startbtn').hide();
            }, this)
            .on(Const.Event.STATE_CHANGED, function(state) {
                this.$el
                    .children().attr('data-state', state);
            }, this);
    },

    render: function() {

        this.$el.html(this.template());
    },

    startPlanting: function() {

        this.app.trigger(Const.Event.START_PLANTING);
    }
});

var Main = {
    View: {
        Main: MainViewMain,
        Dialog: MainViewDialog
    }
}
module.exports = Main;
