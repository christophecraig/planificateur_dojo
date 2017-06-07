define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'],
  function (declare, lang, topic, vueComponent) {
    return declare(null, {
      constructor(compName) {
        this.compName = compName
        this.template = '#clients_tpl'
        this.data = {
          clients: []
        }
        this.createComponent()
      },
      createComponent() {
        this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
      }
    })
  })