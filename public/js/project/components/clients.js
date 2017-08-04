define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'],
  function (declare, lang, topic, vueComponent) {
    return declare(null, {
      constructor(compName) {
        this.compName = compName
        this.template = '#customers_tpl'
        this.data = {
          customers: []
        }
        this.methods = {
          addClient(data) {
            topic.publish('openModal', 'add', data)
          }
        }
        this.created = function() {
          topic.publish('getCustomers')
        }
        this.createComponent()
        topic.subscribe('gotCustomers', lang.hitch(this, 'showCustomers'))
      },
      showCustomers(customers) {
        this.data.customers = customers
      },
      createComponent() {
        this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
      }
    })
  })