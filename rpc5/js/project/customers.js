define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = "#clients_tpl"
            this.data = {}
            this.data.customers = {}
            this.computed = {
                // fullName() {
                //     return (this.data.customers.firstName !== this.data.customers.name)?this.data.customers.firstName + ' ' + this.data.customers.name:this.data.customers.name
                // }
            }
            topic.subscribe('gotCustomers', lang.hitch(this, 'showCustomers'))
            console.log('le subscribe est bien appliqué')
            this.createComponent()
        },
        showCustomers(customers) {
            console.log('showCustomers')
            this.data.customers = customers
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created)
        }
    })
})