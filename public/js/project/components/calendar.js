define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) {
			this.compName = compName
			this.template = '#calendar_tpl'
			this.data = {
				devs: {},
				fromProject: ''
			}
			this.level = 3
			this.levels = [
				'Month',
				'Week',
				'Day',
				'Half Day',
				'Quarter Day'
			]
			topic.subscribe('highlightRelated', lang.hitch(this, 'applyClass')) // doesn't exist yet, goal is to highlight the project in the calendar when we hover it in the developments view
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'))
			topic.subscribe('ganttLoaded', lang.hitch(this, 'storeDevs'))
			this.createComponent()
		},
		storeDevs(devs) {
			console.log('ganttLoaded')
			moment.locale('fr')
			this.data.devs = devs
			this.__gantt = new Gantt('#gantt', this.data.devs, {
				on_date_change(task, start, end) {
					console.log(task, start, end)
				},
				on_progress_change(task, progress) {
					console.log(task, progress)
				},
				on_view_change(mode) {
					console.log('Switched display mode to : ' + mode)
					topic.publish('ganttRendered')
				}
			})
			document.getElementById('zoom-in').addEventListener('click', lang.hitch(this, 'setZoomLevel', 1))
			document.getElementById('zoom-out').addEventListener('click', lang.hitch(this, 'setZoomLevel', 0))
			this.expanded = false
			this.hidden = false
			this.expandBtn = document.getElementById('expand')
			this.hideBtn = document.getElementById('slide-up')
			this.cal = document.getElementById('calendar')
			this.screen = document.getElementById('app')
			document.getElementById('expand').addEventListener('click', lang.hitch(this, 'expandGantt'))
			document.getElementById('slide-up').addEventListener('click', lang.hitch(this, 'hideGantt'))
		},
		expandGantt() {
			if (!this.expanded) {
				var winH = window.innerHeight
				this.cal.style = 'height:' + (winH - 78) + 'px'
				this.expandBtn.classList.add('fa-compress')
				this.hideBtn.classList.remove('fa-angle-down')
				this.expanded = true
				this.hidden = false
			} else {
				this.cal.style = () => {
					if (window.innerWidth < 768) {
						return 'height: 420px'
					} else {
						return 'height: 540px'
					}
				}
				this.expandBtn.classList.remove('fa-compress')
				this.expanded = false
			}
		},
		hideGantt() {
			if (!this.hidden) {
				this.screen.classList.add('slide-up')
				this.cal.style = () => {
					if (window.innerWidth < 768) {
						return 'height: 420px'
					} else {
						return 'height: 540px'
					}
				}
				this.hideBtn.classList.add('fa-angle-down')
				this.expandBtn.classList.remove('fa-compress')
				this.expanded = false
				this.hidden = true
				window.scrollTo(0, 0)
			} else {
				this.screen.classList.remove('slide-up')
				this.hideBtn.classList.remove('fa-angle-down')
				this.hidden = false
			}
		},
		setZoomLevel(arg) {
			if (arg === 1) {
				if (this.level < 4) {
					this.level++
						return this.__gantt.change_view_mode(this.levels[this.level])
				}
			}
			if (arg === 0) {
				if (this.level > 0) {
					this.level--
						return this.__gantt.change_view_mode(this.levels[this.level])
				}
			}
		},
		applyClass(id) {
			for (dev in this.tasks) {
				this.tasks[dev].custom_class = (id === this.tasks[dev].id ? 'is-active' : '')
			}
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