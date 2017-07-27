define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#modal-tpl'
            this.data = {
                test: 'excellent'
            }
            this.updated = function() {
                console.log('updated')
                this.content = document.getElementById('modal').innerHTML
            }
            topic.subscribe('openModal', lang.hitch(this, 'openModal'))
            topic.subscribe('closeModal', lang.hitch(this, 'closeModal'))
            this.createComponent()
        },
        closeModal() {

        },
        openModal(mode, arg) {
            console.log('ok')
            $.sweetModal({
                content: this.content
            })
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
            console.log(this.leComp)
        }
    })
})