import jquery from 'jquery';
import underscore from 'underscore';
import Core from 'core';

const MainViewDialog = Core.View.extend({
  template: underscore.template('\n' +
      '<ul>\n' +
          '<li>Wybierz na mapie miejsce do wysadzania.</li>\n' +
          '<li>Przejdź do Google Street View - przeciągnij żółtego ludzika z lewego górnego rogu i upuść na wybrane miejsce.</li>\n' +
          '<li>Kliknij przycisk "Start planning".</li>\n' +
          '<li>Z panelu po prawej wybieraj elementy do wysadzania.</li>\n' +
      '</ul>\n' +
  ''),

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
