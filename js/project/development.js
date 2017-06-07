define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      // var lodash = require('lodash')
      this.compName = compName
      topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'))
      topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'))
      this.data = {
        developments: null
      }
      this.template = '#development'
      this.methods = {
        openEditModal(e) {
          topic.publish('openEdit', e)
          console.log(e)
          setTimeout(lang.hitch(this, function () {
            this.$children[0].data.isOpen = true
          }), 10)
        },
        deleteDev(e) {
          console.log('suppression du développement ayant l\'id :', e.target.parentElement.parentElement.id)
          topic.publish('deleteDev', this)
        },
        orderByAZ() {
          console.log('ok')
          this.data.developments.sort(lang.hitch(this, this.$root.compare));
        }
      }
      this.createComponent()
    },
    gotDev(dev) {
      console.log('le dev tel quil est recu', dev)
      this.data.developments = dev
    },
    refreshDevs() {
      this.data.developments = []
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})