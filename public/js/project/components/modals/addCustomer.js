define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-customer-tpl'
            this.props = ['isOpen']
            this.data = {
                formContent: {
                    name: '',
                    firstName: ''
                }
            }
            this.methods = {
                addCustomer(id, data) {
                    topic.publish('addCustomer', id, data)
                    topic.publish('refreshCustomers')
                    this.$emit('close')
                }
            }
            this.computed = {
                generateId() {
                    return this.data.formContent.firstName.slice(0,1) + this.data.formContent.name
                },
                _isOpen() {
                    return this.$props.isOpen
                }
            }
            this.updated = function () {
                window.scrollTo({
                    left: 0,
                    top: 640,
                    behavior: 'smooth'
                  })
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})