(function(Core, Main) {

    Main.View.Dialog = Core.View.extend({
        template: _.template('\
            <ul>\
                <li>Wybierz na mapie miejsce do wysadzania.</li>\
                <li>Przejdź do Google Street View - przeciągnij żółtego ludzika z lewego górnego rogu i upuść na wybrane miejsce.</li>\
                <li>Kliknij przycisk "Start planning".</li>\
                <li>Z panelu po prawej wybieraj elementy do wysadzania.</li>\
            </ul>\
        '),

        title: 'Pierwszy raz z planting',
        dialogOptions: {
            modal: true,
            width: 500,
            buttons: {
                Zaczynam: function() {
                    $(this).dialog('close');
                }
            }
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
        }
    });

}(Planting.module('core'), Planting.module('main')));
