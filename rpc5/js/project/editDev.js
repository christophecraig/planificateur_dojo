define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.data = {
        resources: [{}],
        isOpen: false
        // dev: {
        //   plannedEnd: "",
        //   id: "",
        //   earlyStart: null,
        //   effort: 0,
        //   earlyEnd: null,
        //   optional: false,
        //   plannedStart: "",
        //   lateEnd: null,
        //   parentDevelopment: null,
        //   name: "",
        //   lateStart: null,
        //   previousDevelopment: null,
        //   priority: "",
        //   realEnd: null,
        //   realStart: null,
        //   resources: [],
        //   skillTags: [],
        //   status: 0,
        // }
      }
      this.created = function () {
        topic.subscribe('populateEditModal', lang.hitch(this, this.fillEdit))
      }
      this.methods = {
        close() {
          topic.publish('closeEditModal')
        },
        fillEdit(dev) {
          console.log('voyons')
          this.$store.commit('populate', dev)
        }
      }
      this.computed = {
        dev() {
          return this.$store.state.openEdit
        }
      }
      this.template = '#edit_the_dev'
      topic.subscribe('closeModal', lang.hitch(this, 'close'))
      topic.subscribe('closeEditModal', lang.hitch(this, 'close'))
      topic.subscribe('openEdit', lang.hitch(this, 'openEdit'))
      topic.subscribe('populateEditModal', lang.hitch(this, 'populate'))
      this.createComponent()
    },
    close() {
      this.data.isOpen = false
    },
    openEdit(e) {
      this.data.isOpen = true
      this.devId = e.target.parentElement.parentElement.id
      topic.publish('fetchDev', this.devId)
    },
    populate(dev) {
      this.data.dev = dev
      console.log('ça devrait updater le store')
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created)
    }
  })
})