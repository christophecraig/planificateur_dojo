define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function(declare, lang, topic, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      topic.subscribe('closeModal', lang.hitch(this, 'closeAddDev'))
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
          "optional": false,
          "effort": 0,
          "skillTags": [],
          "project": ""
        },
        isOpen: false
      }
      this.methods = {
        submitNewDev(dev) {
          console.log(dev) // TODO: Trouver pourquoi le publish ne veut pas envoyer le dev
          topic.publish('saveDev', dev)
        }
      }
      topic.subscribe('openAddDev', lang.hitch(this, 'open'))
      this.createComponent()
    },
    closeAddDev() {
      this.data.isOpen = false
    },
    open() {
      this.data.isOpen = true;
        topic.publish('getSkills')
    },
    populate(skills) {
      this.data.allSkills = skills
      this.data.isOpen = true      
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  });
});
