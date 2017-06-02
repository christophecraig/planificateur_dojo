define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      // var lodash = require('lodash')
      this.compName = compName
      topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'))
      topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'))
      this.data = {
        developments: [{}]
      }
      this.template = '#development'
      this.methods = {
        openEditModal(e) {
          topic.publish('openEdit', e)
        },
        deleteDev(e) {
          console.log('suppression du développement ayant l\'id :', e.target.parentElement.parentElement.id)
          topic.publish('deleteDev', this)
        },
        orderByAZ() {
          var devs = this.data.developments
          console.log(this.data.developments)
          // this.data.developments = _.sortBy(devs, ['name'])
        }
      }
      this.createComponent()
    },
    gotDev(dev) {
      this.data.developments.push(dev)
    },
    refreshDevs() {
      this.data.developments = []
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted)
    }
  });
});
