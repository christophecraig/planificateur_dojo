define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) { // affProject ne prend que l'élément en argument
      this.compName = compName
      this.template = '#projects_tpl'
      this.data = {
        project: {},
        notification: '',
        isOpen: false
      }
      this.methods = {
        open() {
          this.data.isOpen = true
        },
        close() {
          this.data.isOpen = false
        },
        sumbitProj() {
          topic.publish('addProj', this.data.project)
        },
        openProject(id) {
          topic.publish('getDetailedProject', id)
          this.$parent.$emit('changeView', this.$root.lastView, 'detailedProject')
        }
      }
      this.createComponent()
      topic.subscribe('gotProjects', lang.hitch(this, 'displayProj'))
      topic.subscribe('error', lang.hitch(this, 'alertError'))
    },
    displayProj(proj) {
      this.data.project = proj
    },
    alertError() {
      this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.'
      setTimeout(lang.hitch(this, function() {
        this.data.notification = ''
      }), 2800)
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})
