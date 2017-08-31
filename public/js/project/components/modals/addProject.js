define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-project'
            this.props = ['isOpen']
            this.data = {
                project: {
                    id: '',
                    priority: '',
                    customerSpirit: {
                        client: '',
                        spirit: '',
                    },
                    developersSpirit: ''
                }
            }
            this.methods = {

            }
            this.computed = {
                _isOpen() {
                    return this.$props.isOpen
                }
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})