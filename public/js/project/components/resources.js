define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#resource-tpl'
      this.data = {
        resources: {}
      }
      this.methods = {
        openAddRes() {
          topic.publish('openAddRes')
        },
        editRes(id) {
          topic.publish('editRes')
        },
        getDetailedResource(id) {
          topic.publish('getDetailedResource', id)          
        }
      }
      this.createComponent()
      topic.subscribe('gotResources', lang.hitch(this, 'showResources'))
    },
    showResources(resources) {
      this.data.resources = resources
      setTimeout(topic.publish('loaded'), 200)
    },
    getHolidays(e) {
      // for (var i = 0; i < this.data.resources.length; i++) {
      //   for (var i = 0; i < this.data.resources.length; i++) {
      //     topic.publish(e.target.id)
      //   }
      // }
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})
