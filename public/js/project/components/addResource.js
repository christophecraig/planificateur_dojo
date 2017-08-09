define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-res-tpl'
            this.data = {
                id:'',
                name:'',
                firstName: ''
            }
            this.methods = {
                close() {
                    this.$root.modalOpen = false
                },
                submitResource() {
                    topic.publish('submitNewResource', this.id, this.name, this.firstName)
                }
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})