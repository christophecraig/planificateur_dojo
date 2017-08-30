define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#resource-tpl'
      this.data = {
        isOpen: false,
        addIsOpen: false,
        resources: {}
      }
      this.methods = {
        openAddRes() {
          // topic.publish('openAddRes')
          this.data.addIsOpen = true
        },
        close () {
          this.data.isOpen = false
          this.data.addIsOpen = false
					window.scrollTo({
						top:0,
						left:0,
						behavior: 'smooth'
					})
        },
        editRes(id) {
          this.data.isOpen = true
          topic.publish('editRes')
        },
        getDetailedResource(id) {
          this.data.isOpen = true
          topic.publish('getDetailedResource', id)          
        }
      }
      this.createComponent()
      topic.subscribe('gotResources', lang.hitch(this, 'showResources'))
    },
    showResources(resources) {
      this.data.resources = resources
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
