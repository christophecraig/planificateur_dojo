define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function(declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor(ws) {
      this.ws = ws
      this.data = []
    },
    get(ids) {
      console.log(ids)
      var def = new Deferred()
      for (var i = 0; i < ids.length; i++) {
        this.ws.getDetailedDevelopment(this.ids[i]).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError'))
      }
      return def
    },
    gotDev(def, dev) {
      console.log(dev)
      this.data.push(dev)
      def.resolve(this.data)
    },
    reportError() {
      console.log(err)
    }
  })
})