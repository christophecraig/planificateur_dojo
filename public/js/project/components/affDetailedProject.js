define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) { // affProject ne prend que l'élément en argument
      this.compName = compName
      this.template = '#detailed_project'
      // on initialise le data utilisé pour qu'il soit rendu dans la vue même s'il n'est pas encore rempli
      this.data = {
        detailedProject: {
          name: '',
          developments: [],
          developersMind: {},
          isOpen: false
        },
        notification: ''
      }
      this.methods = {
        addDev() {
          topic.publish('openAddDev')
        }
      }
      this.createComponent()
      topic.subscribe('gotDetailedProject', lang.hitch(this, 'displayExpProj'))
      topic.subscribe('error', lang.hitch(this, 'alertError'))
    },
    displayExpProj(proj) {
      this.data.detailedProject = proj
      setTimeout(topic.publish('loaded'), 200)
    },
    alertError() {
      this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.'
      setTimeout(lang.hitch(this, function() {
        this.data.notification = ''
      }), 3500)
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  });
});
