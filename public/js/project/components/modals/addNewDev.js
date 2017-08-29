define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      topic.subscribe('gotSkills', lang.hitch(this, this.populate))
      this.template = '#add-dev-tpl'
      this.data = {
        dev: {
          "id": "",
          "name": "",
          "earlyStart": null,
          "lateStart": null,
          "realStart": null,
          "plannedStart": null,
          "earlyEnd": null,
          "lateEnd": null,
          "realEnd": null,
          "plannedEnd": null,
          "status": 0,
          "priority": "",
          "optional": false,
          "effort": 0,
          "skillTags": [],
          "project": ""
        },
        allSkills: []
      }
      this.props = ['isOpen']
      this.methods = {
        submitNewDev(dev) {
          console.log(dev) // TODO: Trouver pourquoi le publish ne veut pas envoyer le dev
          topic.publish('saveDev', dev)
        }
      }
      this.computed = {
        _isOpen () {
          return this.$props.isOpen
        }
      }
      this.createComponent()
    },
    populate (skills) {
      this.data.allSkills = skills
    },
    createComponent () {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  });
});