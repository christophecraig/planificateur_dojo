define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.data = {
        resources: [{}],
        isOpen: false,
        title: '',
        client: '',
        endDate: '',
        startDate: ''
      }
      this.methods = {
        close() {
          topic.publish('closeEditModal')
        }
      }
      this.template = '#edit_the_dev'
      topic.subscribe('closeModal', lang.hitch(this, 'close'))
      topic.subscribe('closeEditModal', lang.hitch(this, 'close'))
      topic.subscribe('gotDetailedProject', lang.hitch(this, 'populate'))
      topic.subscribe('openEdit', lang.hitch(this, 'openEdit'))
      this.createComponent()
    },
    close() {
      this.data.isOpen = false
    },
    openEdit(e) {
      this.devId = e.target.parentElement.parentElement.id
    },
    populate(dev) {
      this.data.dev = dev
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})
