define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#resource_tpl'
      this.data = {}
      this.data.resources = {}
      this.methods = {
        addRes() {
          topic.publish('addRes')
        },
        editRes(id) {
          topic.publish('editRes')
        },
        getDetailedResource(id) {
          console.log(id)
          topic.publish('getDetailedResource', id)          
        }
      }
      // this.mounted = function() {
      // for (resource in this.data.resources) {
      //   this.data.ids.push(resource.id)
      //   console.log('teeeeeeeeeest')
      // }
      // }
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
