define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent', 'chartJS'], function (declare, lang, topic, vueComponent, chartJS) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#detailed-resource-tpl'
      this.data = {
        isOpen: false,
        res: {
          id: '',
          name: '',
          firstName: '',
          baseEfficiency: 0,
          holidays: [],
          skillEfficiency: []
        }
      }
      this.methods = {
        drawBar(value) {
          var skill = 160*0.7
          return 'M 0 0 L ' +skill+ ' 0 L ' + skill + ' 9 L 0 9'
        }
      }
      this.computed = {
        fullName() {
          return this.data.res.firstName + ' ' + this.data.res.name
        }
      }
      topic.subscribe('closeModal', lang.hitch(this, 'closeResource'))
      topic.subscribe('gotDetailedResource', lang.hitch(this, 'showResource'))
      this.createComponent()
    },
    closeResource() {
      console.log('test')
      this.data.isOpen = false
    },
    showResource(res) {
      this.data.isOpen = true
      this.data.res = res
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})