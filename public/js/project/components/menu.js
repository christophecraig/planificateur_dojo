define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor: function(compName) {
            this.compName = compName;
            this.template = '#menu_tpl';
            this.data = {
                // TODO : pouvoir mettre les éléments du menu ici et plus dans le html
                menu: ['Développements', 'Ressources', 'Infos pratiques', 'Clients'] // A recupérer autrement ?
            };
            this.mounted = function() {

            };
            this.createComponent();
        },
        createComponent: function() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
        }
    });
});
