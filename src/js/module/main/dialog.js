import jquery from 'jquery';
import { View } from 'core';

const MainViewDialog = View.extend({
  template: require('./dialog.hbs'),

  title: 'Pierwszy raz z planting',
  dialogOptions: {
    modal: true,
    width: 500,
    buttons: {
      Zaczynam: function() {
        jquery(this).dialog('close');
      },
    },
  },

  initialize: function() {
    this.render();
  },

  render: function() {
    this.$el
      .attr('title', this.title)
      .html(this.template())
      .dialog(this.dialogOptions);
  },

  close: function() {
    this.$el.dialog('close');
  },
});

require('jquery-ui');

module.exports = MainViewDialog;
