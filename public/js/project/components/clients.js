define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'],
  function (declare, lang, topic, vueComponent) {
    return declare(null, {
      constructor(compName) {
        this.compName = compName
        this.template = '#clients_tpl'
        this.data = {
          clients: []
        }
        this.methods = {
          addClient() {
            topic.publish('openModal', 'add', 'clients')
          }
        }
        this.created = function() {
          topic.publish('getClients')
        }
        this.createComponent()
        topic.subscribe('gotClients', lang.hitch(this, 'showClients'))
      },
      showClients(clients) {
        this.data.clients = clients
      },
      createComponent() {
        this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
      }
    })
  })