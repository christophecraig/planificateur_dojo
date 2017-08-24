define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor (compName) {
            this.compName = compName
            this.data = {
                isLoading: true
            }
            this.template = '#load_tpl'

            topic.subscribe('loading', lang.hitch(this, 'loading'))
            topic.subscribe('loaded', lang.hitch(this, 'loaded'))
            topic.subscribe('ganttLoaded', lang.hitch(this, 'loaded'))
            topic.subscribe('error', function(){console.log('err')})     
            this.createComponent()
        },
        loading () {
            this.data.isLoading = true
        },
        loaded () {
            this.data.isLoading = false
        },
        createComponent () {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
        }
    });
});
