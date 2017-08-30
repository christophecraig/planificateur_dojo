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
    add(id, data) {
      var def = new Deferred()
      this.ws.addCustomer({
        id: id,
        name: data.name,
        firstName: data.firstName
      }).then(lang.hitch(this, 'customerAdded', def), lang.hitch(this, 'reportError', def))
      return def
    },
    gotCustomers(def, res) {
      def.resolve(res)
    },
    customerAdded(def, res) {
      def.resolve(res)
    },
    reportError(def) {
      def.reject('not found')
    }
  })
})