define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.data = {
        resources: [{}],
        dev: {
          isOpen: false,
          title: '',
          client: '',
          endDate: '',
          startDate: '',
          earlyEnd: '',
          earlyStart: '',
          effort: '',
          id: '',
          lateEnd: '',
          lateStart: '',
          name: '',
          optional: false,
          parentDevelopment: '',
          plannedEnd: '',
          plannedStart: '',
          previousDevelopment: '',
          priority: '',
          realEnd: '',
          realStart: '',
          resources: [],
          skillTags: [],
          status: ''
        }
      }
      this.methods = {
        close() {
          topic.publish('closeEditModal')
        }
      }
      this.template = '#edit_the_dev'
      topic.subscribe('closeModal', lang.hitch(this, 'close'))
      topic.subscribe('closeEditModal', lang.hitch(this, 'close'))
      topic.subscribe('gotDetailedDevelopment', lang.hitch(this, 'populate'))
      this.createComponent()
    },
    close() {
      this.data.isOpen = false
    },
    populate(dev) {
      console.log(dev)
      this.data.dev = dev
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})