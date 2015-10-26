import underscore from 'underscore';
import Core from 'core';
import MainViewDialog from 'module/main/dialog';
import Const from 'const';

const MainViewMain = Core.View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: underscore.template('\n' +
      '<div class="plantingjs-proxy">\n' +
          '<div class="plantingjs-startbtn">\n' +
              '<span class="icon-menu-hamburger"></span>\n' +
               'Start planting!\n' +
          '</div>\n' +
          '<div class="layers-menu"></div>\n' +
          '<div class="plantingjs-toolbox"></div>\n' +
          '<div class="plantingjs-overlay ui-droppable"></div>\n' +
          '<div class="plantingjs-google"></div>\n' +
          '<div class="plantingjs-dialog"></div>\n' +
      '</div>\n' +
  ''),
  events: {
    'click .plantingjs-startbtn': 'startPlanting',
  },

  $proxy: null,

  initialize: function() {
    this.render();
    this.$proxy = this.$el.children();
    this.dialog = new MainViewDialog({
      el: this.el.querySelector('.plantingjs-dialog'),
      app: this.app,
    });
    this.app
      .on(Const.Event.VISIBLE_CHANGED, function(visible) {
        if (this.app.getState() !== Const.State.VIEWER) {
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
  },
});

const Main = {
  View: {
    Main: MainViewMain,
    Dialog: MainViewDialog,
  },
};

module.exports = Main;
