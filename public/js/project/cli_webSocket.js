define(['dojo/_base/declare', 'dojo/topic'], function (declare, topic) {
  return declare(null, {
    constructor() {
      var socket = io()
      topic.subscribe('openEdit', 'emitEditing')
    },
    emitEditing(dev) {
      console.log('test')
      io.emit('editing', dev)
    }
  })
})