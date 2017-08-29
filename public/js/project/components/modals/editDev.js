define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.props = ['isOpen']
			this.data = {
				show: false,
				dev: {
					endDate: '',
					startDate: '',
					earlyEnd: '',
					earlyStart: '',
					effort: '',
					id: '',
					lateEnd: '',
					lateStart: '',
					name: '',
					optional: false,
					parentDevelopment: '',
					plannedEnd: '',
					plannedStart: '',
					previousDevelopment: '',
					priority: '',
					realEnd: '',
					realStart: '',
					resources: [],
					skillTags: [],
					status: ''
				},
				allSkills: [] // TODO: peupler via le store de ressources
			}
			this.methods = {
				saveDev(dev) {

				}
			}
			this.computed = {
				_isOpen () {
					return this.$props.isOpen
				}
			}
			this.template = '#edit_the_dev'
			topic.subscribe('closeModal', lang.hitch(this, 'close'))
			topic.subscribe('closeEditModal', lang.hitch(this, 'close'))
			topic.subscribe('gotDetailedDevelopment', lang.hitch(this, 'populate'))
			topic.subscribe('gotSkills', lang.hitch(this, 'populateSkills'))			
			this.createComponent()
		},
		close(dev) {
			if (this.data.isOpen) {
				this.data.isOpen = false
				topic.publish('stopEdit', dev)
			}
		},
		populateSkills(skills) {
			this.data.allSkills = skills
		},
		populate(dev) {
			this.data.dev = dev
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
		}
	})
})