define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				months: [{
					name: 'Janvier',
					num: 1
				},{
					name: 'Février',
					num: 2
				},{
					name: 'Mars',
					num: 3
				},{
					name: 'Avril',
					num: 4
				},{
					name: 'Mai',
					num: 5
				},{
					name: 'Juin',
					num: 6
				},{
					name: 'Juillet',
					num: 7
				},{
					name: 'Août',
					num: 8
				},{
					name: 'Septembre',
					num: 9
				},{
					name: 'Octobre',
					num: 10
				},{
					name: 'Novembre',
					num: 11
				},{
					name: 'Décembre',
					num: 12
				}],
				devs: {},
				fromProject: ''
			}
			this.updated = {
				function() {
					console.log('ça marche')
					this.test()
			}}
			this.createComponent()
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'))
		},
		test() {
			console.log('parfait')
		},
		drawProjects(devs) {
			this.data.devs = devs
			console.log(typeof this.data.devs)


			document.getElementById('body').classList.remove('loading')
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