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
      var def = new Deferred()
      this.ws.editResource().then(lang.hitch(this, 'resourceEdited'), lang.hitch(this, 'reportError'))
      return def
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
      def.resolve(res)
    },
    gotResources(def, res) {
      def.resolve(res)
    },
    resourceAdded(def, res) {

    },
    reportError() {
      def.reject('not found')
    }
  })
})