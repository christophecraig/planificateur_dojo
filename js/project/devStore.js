define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = []
      console.log('le store existe')
    },
    get: function (ids) {
      if (ids) {
        console.log('quelque chose est parvenu au store')
        var def = new Deferred()
        for (var i = 0; i < ids.length; i++) {
          console.log('ok')
          this.ws.getDetailedDevelopment(this.ids[i]).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError'))
          console.log('test')
        }
        return def
      }
    },
    gotDev: function (def, dev) {
      console.log('ici les dév du store ', dev)
      this.data.push(dev)
      def.resolve(this.data)
    },
    reportError: function () {
      console.log(err)
    }
  })
})