define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) { // affProject ne prend que l'élément en argument
      this.compName = compName
      this.template = '#projects'
      this.data = {
        project: {},
        notification: '',
        modalIsOpen: false
      }
      this.methods = {
        openModal() {
          this.data.modalIsOpen = true
        },
        addProj() {
          topic.publish('addProj')
        }
      }
      this.createComponent()
      topic.subscribe('gotProjects', lang.hitch(this, 'displayProj'))
      topic.subscribe('error', lang.hitch(this, 'alertError'))
    },
    displayProj(proj) {
      this.data.project = proj
      setTimeout(topic.publish('loaded'), 250)
    },
    alertError() {
      this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.'
      setTimeout(lang.hitch(this, function() {
        this.data.notification = ''
      }), 2800)
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted)
    }
  })
})
