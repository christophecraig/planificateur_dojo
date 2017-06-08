define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'))
      topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'))
      this.data = {
        developments: null
      }
      this.template = '#development'
      this.methods = {
        openEditModal(dev) {
          topic.publish('openEdit', dev)
          setTimeout(lang.hitch(this, function () {
            this.$children[0].data.isOpen = true
          }), 10)
        },
        deleteDev(dev) {
          console.log('suppression du développement ayant l\'id :', dev)
          topic.publish('deleteDev', dev)
        },
        orderByAZ() {
          this.data.developments.sort(lang.hitch(this, this.$root.alpha));
        },
        orderByDate() {
          // ne marche pas pour le moment
          this.data.developments.sort(lang.hitch(this, this.$root.date))
        }
      }
      this.createComponent()
    },
    gotDev(dev) {
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