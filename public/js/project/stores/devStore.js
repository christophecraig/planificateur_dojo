define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor(ws) {
      this.ws = ws
      console.log(this)
    },
    get(id) {
      var def = new Deferred()
      this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError'))
      return def
    },
    query(ids) {
      this.data = []
      var def = new Deferred()
      for (var i = 0; i < ids.length; i++) {
        this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def), lang.hitch(this, 'reportError'))
      }
      return def
    },
    add(dev) {
      var def = new Deferred()
      this.ws.addDevelopment(dev).then(lang.hitch(this, 'devAdded', def), lang.hitch(this, 'reportError'))
      return def
    },
    gotDev(def, dev) {
      def.resolve(dev)
    },
    gotDevs(def, dev) {
      this.data.push(dev)
      def.resolve(this.data)
    },
    devAdded(def, dev) {
      console.log('et on ajoute ceci', dev)
      def.resolve(dev)
    },
    reportError() {
      def.reject('not found')
    }
  })
})