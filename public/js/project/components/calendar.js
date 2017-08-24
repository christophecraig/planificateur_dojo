define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				devs: {},
				fromProject: ''
			}
			this.createComponent()
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'))
		},
		drawProjects(devs) {
			topic.publish('ganttLoaded', devs)
		},
		getColor(idProj) {
			switch (idProj) {
				case '':
					return
					break;
			}
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extends)
		}
	})
})