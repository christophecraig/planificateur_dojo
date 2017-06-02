define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#detailed_resource'
      this.data = {
        isOpen: false,
        res: {}
      }
      this.methods = {
        getHolidays(e) {
          console.log(e)
          topic.publish('getHolidays', e)
        },
        showResource(res) {
          this.data.isOpen = true
          this.data.res = res
        }
      }
      this.computed = {
        fullName() {
          return this.data.res.firstName + ' ' + this.data.res.name
        }
      }
      this.created = function() {
        topic.subscribe('gotDetailedResource', lang.hitch(this, 'showResource'))
      }
      this.createComponent()
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})