define(['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.template = '#detailed-resource-tpl'
			this.props = ['isOpen']
			this.data = {
				res: {
					id: '',
					name: '',
					firstName: '',
					baseEfficiency: 0,
					holidays: [],
					skillEfficiency: []
				},
				holidays: [],
				allSkills: []
			}
			this.methods = {
				drawBar(value) {
					window.scrollTo({
						left: 0,
						top: 640,
						behavior: 'smooth'
					  })
					var skill = 400 * value
					return 'M 0 0 L ' + skill + ' 0 L ' + skill + ' 40 L 0 40'
				},
				edit() {
					this.data.edit = true
				},
			}
			this.computed = {
				fullName() {
					return this.data.res.firstName + ' ' + this.data.res.name
				},
				_isOpen() {
					return this.$props.isOpen
				}
			}
			topic.subscribe('gotDetailedResource', lang.hitch(this, 'showResource'))
			topic.subscribe('gotHolidays', lang.hitch(this, 'populateHolidays'))
			// topic.subscribe('gotSkills', lang.hitch(this, 'populateSkills'))
			this.createComponent()
		},
		showResource(res) {
			this.data.res = res
			this.data.holidays = []
		},
		populateHolidays(holidays) {
			holidays.beginning = new Date(holidays.beginning).toLocaleDateString()
			holidays.ending = new Date(holidays.ending).toLocaleDateString()
			this.data.holidays.push(holidays)
			console.log(holidays)
		},
		// populateSkills(skills) {
		// 	this.data.allSkills = skills
		// },
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
		}
	})
})