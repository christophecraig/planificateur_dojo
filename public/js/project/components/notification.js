define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#notification-tpl'
            this.data = {
                visible: false,
                type: '',
                title: '',
                message: ''
            }
            this.methods = {

            }
            topic.subscribe('notify', lang.hitch(this, 'showNotification'))
            this.createComponent()
        },
        showNotification(type, title, message) {
            this.data.tit = title
            this.data.typ = type
            this.data.message = message
            this.data.visible = true
            setTimeout(() => {
                this.data.visible = false
            }, 3000)
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})