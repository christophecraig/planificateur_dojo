define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				devs: {},
				fromProject: ''
			}
			this.updated = {
				function () {
					console.log('ça marche')
					this.test()
				}
			}
			this.createComponent()
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'))
		},
		drawProjects (devs) {
			this.data.devs = devs
			this.tasks = []
			for (var dev in devs) {
                this.tasks.push({}) // Pour ne pas se prendre un "undefined"
                for (var prop in devs[dev]) {
                    if (devs[dev][prop] !== null) {
                        switch (prop) {
                            case 'earlyStart':
                            case 'plannedStart':
                            case 'realStart':
                            case 'lateStart':
                                this.tasks[dev].start = devs[dev][prop]
                                break
                            case 'earlyEnd':
                            case 'plannedEnd':
                            case 'realEnd':
                            case 'lateEnd':
                                this.tasks[dev].end = devs[dev][prop]
                                break
                            case 'id':
                                this.tasks[dev].id = devs[dev][prop]
                                break
                            case 'name':
                                this.tasks[dev].name = devs[dev][prop]
                                break
                            case 'effort':
                                this.tasks[dev].progress = devs[dev][prop]
                                break
                        }
                    }
                }
			}
			topic.publish('tasks', devs, this.tasks)
		},
		getColor (idProj) {
			switch (idProj) {
				case '':
					return
					break;
			}
		},
		createComponent () {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extends)
		}
	})
})