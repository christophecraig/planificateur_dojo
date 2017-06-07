define(['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = null
    },
    get(id) {
      this.data = []
      var def = new Deferred()
        this.ws.getAResource(id).then(lang.hitch(this, 'gotResource', def), lang.hitch(this, 'reportError'))
      return def
    },
    query() {

    },
    gotResource(def, res) {
      console.log(res)
      this.data = res
      def.resolve(this.data)
    },
    reportError() {
      def.reject('not found')
    }
  })
})