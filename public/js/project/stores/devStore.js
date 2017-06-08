define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = null
    },
    get (id) {
      var def = new Deferred()
      this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError'))
      return def
    },
    query: function (ids) {
      this.data = []
      var def = new Deferred()
      for (var i = 0; i < ids.length; i++) {
        this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def), lang.hitch(this, 'reportError'))
      }
      return def
    },
    gotDev (def, dev) {
      console.log('store ' + dev)
      def.resolve(dev)
    },
    gotDevs: function (def, dev) {
      this.data.push(dev)
      def.resolve(this.data)
      console.log('je suis dans le store')
    },
    reportError: function () {
      def.reject('not found')
    }
  })
})