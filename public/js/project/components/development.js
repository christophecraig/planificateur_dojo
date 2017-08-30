define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'))
			topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'))
			this.data = {
				isOpen: false
			}
			this.template = '#development'
			this.mounted = function () {
				this.previousDev = null
			}
			this.updated = function () {
				// initialisation du this.previousDev
				console.log(this.data)
				// console.log(this.previousDev, this.data.developments[0].id)
				if (this.data.developments[0].id !== this.previousDev) {

					if (this.previousDev === null) {
						this.previousDev = this.data.developments[0].id
					}
					if (this.data.developments[0].id !== this.previousDev) {
						console.log('updated')
						this.data.isOpen = false
					}
					this.previousDev = this.data.developments[0].id
				}
			}
			this.methods = {
				deleteDev(dev, property) {
					console.log('Préparation à la suppression du développement ayant l\'id :', dev)
					topic.publish('deleteDev', dev, property)
				},
				open(dev) {
					topic.publish('getSkills')
					this.data.isOpen = true
					topic.publish('openEditDev', dev)
				},
				close() {
					this.data.isOpen = false
					window.scrollTo({
						top:0,
						left:0,
						behavior: 'smooth'
					})
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
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended, this.directives)
		}
	})
})