define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor (compName) {
            this.compName = compName
            this.data = {}
            this.template = '#load_tpl'
            this.mounted = function () {
                topic.subscribe('loading', this.$root.loading)
                topic.subscribe('loaded', this.$root.loaded)
                topic.subscribe('error', function(){console.log('err')})
            };
            this.createComponent()
        },
        createComponent () {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted)
        }
    });
});
