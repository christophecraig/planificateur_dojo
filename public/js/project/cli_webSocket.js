define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang'], function (declare, topic, lang) {
  return declare(null, {
    constructor() {
      this.socket = io()
      topic.subscribe('openEdit', lang.hitch(this, 'emitEditing'))
      topic.subscribe('stopEdit', lang.hitch(this, 'stopEditing'))
      this.socket.on('blockEdit', lang.hitch(this, 'alertEditing'))
    },
    alertEditing(dev) {
      console.log(dev)
      $.sweetModal({
        content: "<strong role='alert'>Quelqu'un est déjà en train d'éditer ce développement !</strong>",
        icon: $.sweetModal.ICON_WARNING
      })
      console.log('test')
      setTimeout(() => {
        topic.publish('closeEditModal')
      }, 20)
    },
    emitEditing(dev) {
      this.socket.emit('editing', dev)
    },
    stopEditing(dev) {
      this.socket.emit('stopEdit', dev)
    }
  })
})