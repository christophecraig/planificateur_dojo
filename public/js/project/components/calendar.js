define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function (compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				message: 'message de qualité',
				projects: {}
			}
			// this.extends = VueChartJs.Line
			this.createComponent()
			topic.subscribe('gotFullProjects', lang.hitch(this, 'drawProjects'))
		},
		drawProjects(projects) {
			this.data.projects = projects
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.extends)
		}
	})
})