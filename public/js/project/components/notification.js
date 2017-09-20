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
        showNotification(type, message) {
            document.getElementById('notification').classList = []
            this.data.typ = type
            this.data.message = message
            if (type === 'success') {
                document.getElementById('notification').classList.add('success')
            } else if (type === 'failure') {
                document.getElementById('notification').classList.add('failure')
            }
            this.data.visible = true
            setTimeout(() => {
                this.data.visible = false
            }, 4000)
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})