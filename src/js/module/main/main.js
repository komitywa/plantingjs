import { View } from 'core';
import MainViewDialog from 'module/main/dialog';
import Const from 'const';

const MainViewMain = View.extend({
  toolbox: null,
  map: null,
  className: 'plantingjs-container',
  template: require('./main.hbs'),
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
