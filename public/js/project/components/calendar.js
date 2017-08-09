define(['VueChartJS', 'dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (VueChartJS, declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function (compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				message: 'message de qualité',
				devs: {}
			}
			this.createComponent()
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'))
		},
		drawProjects(devs) {
			this.data.devs = devs
			console.log(VueChartJS)
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.extends)
		}
	})
})