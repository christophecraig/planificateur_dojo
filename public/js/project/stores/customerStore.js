define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor(ws) {
      this.ws = ws
      this.data = null
    },
    query() {
      var def = new Deferred()
      this.ws.getCustomers().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
      return def
    },
    put() {
      var def = new Deferred()
      this.ws.editCustomer().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
      return def
    },
    add() {
      var def = new Deferred()
      this.ws.addCustomer({
        id: id,
        name: name,
        firstName: firstName
      }).then(lang.hitch(this, 'resourceAdded'), lang.hitch(this, 'reportError'))
      return def
    },
    gotCustomers(def, res) {
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