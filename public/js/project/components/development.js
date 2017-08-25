define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'))
			topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'))
			this.data = {
				editDevIsOpen: true
			}
			this.template = '#development'
			this.methods = {
				deleteDev(dev, property) {
					console.log('Préparation à la suppression du développement ayant l\'id :', dev)
					topic.publish('deleteDev', dev, property)
				},
				openEditDev(dev) {
					this.data.editDevIsOpen = true
					topic.publish('openEditDev', dev)
				},
				close () {
					this.data.isOpen = false
				  },
			}
			topic.subscribe('closeModal', lang.hitch(this, 'closeEditDev'))
			this.createComponent()
		},
		closeEditDev() {
			this.data.editDevIsOpen = false
		},
		gotDev(dev) {
			this.data.developments = dev
		},
		refreshDevs() {
			this.data.developments = []
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
		}
	})
})