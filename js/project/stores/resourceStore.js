define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = null
    },
    get(id) {
      this.data = []
      var def = new Deferred()
      this.ws.getAResource(id).then(lang.hitch(this, 'gotDetailedResource', def), lang.hitch(this, 'reportError'))
      return def
    },
    query() {
      var def = new Deferred()
      this.ws.getResources().then(lang.hitch(this, 'gotResources', def), lang.hitch(this, 'reportError'))
      return def
    },
    put() {

    },
    add() {
      var def = new Deferred()
      this.ws.addResource({
        id: id,
        name: name,
        firstName: firstName
      }).then(lang.hitch(this, 'resourceAdded'), lang.hitch(this, 'reportError'))
      return def
    },
    gotDetailedResource(def, res) {
      console.log('Resource détaillée', res)
      def.resolve(this.data)
    },
    gotResources(def, res) {
      console.log('Resources au pluriel', res)
      def.resolve(res)
    },
    resourceAdded(def, res) {

    }
    reportError() {
      def.reject('not found')
    }
  })
})