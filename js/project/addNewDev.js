define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function(declare, lang, topic, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      topic.subscribe('closeModal', lang.hitch(this, this.closeAddDev))
      topic.subscribe('openAddDev', lang.hitch(this, this.open))
      topic.subscribe('gotSkills', lang.hitch(this, this.populate))
      this.template = '#modal_form'
      this.data = {
        newDevInfos: {
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
          "project": ""
        },
        skills: {test: 'bravo'},
        isOpen: false
      }
      this.created = function() {
        topic.subscribe('closeModal', lang.hitch(this, this.close))
      }
      this.methods = {
        close() {
          this.data.isOpen = false
        },
        submitNewDev() {
          topic.publish('saveDev')
        }
      }
      this.createComponent()
    },
    closeAddDev() {
      this.data.isOpen = false
    },
    open() {
      setTimeout(lang.hitch(this, function() {
        this.data.isOpen = true
        topic.publish('getSkills')
      }), 10)},
    populate(skills) {
      this.data.skills = skills
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.created)
    }
  });
});
