define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang'], function (declare, topic, lang) {
  return declare(null, {
    constructor() {
      this.socket = io()
      this.socket.on('blockEdit', function() {
        console.log('ARRETEZ')
      })
      topic.subscribe('openEdit', lang.hitch(this, 'emitEditing'))
    },
    emitEditing(dev) {
      this.socket.emit('editing', dev)
    }
  })
})