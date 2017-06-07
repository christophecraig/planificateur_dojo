define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = null
    },
    get: function (ids) {
      this.data = []
      var def = new Deferred()
      for (var i = 0; i < ids.length; i++) {
        this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError'))
      }
      return def
    },
    gotDev: function (def, dev) {
      this.data.push(dev)
      def.resolve(this.data)
    },
    reportError: function () {
      def.reject('not found')
    }
  })
})