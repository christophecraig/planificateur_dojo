define('project/stores/customerStore',['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor(ws) {
      this.ws = ws
      this.data = null
    },
    query() {
      var def = new Deferred()
      this.ws.getCustomers().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
      return def
    },
    put() {
      var def = new Deferred()
      this.ws.editCustomer().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
      return def
    },
    add(id, data) {
      var def = new Deferred()
      this.ws.addCustomer({
        id: id,
        name: data.name,
        firstName: data.firstName
      }).then(lang.hitch(this, 'customerAdded', def), lang.hitch(this, 'reportError', def))
      return def
    },
    gotCustomers(def, res) {
      def.resolve(res)
    },
    customerAdded(def, res) {
      def.resolve(res)
    },
    reportError(def) {
      def.reject('not found')
    }
  })
});
define('project/stores/projectStore',['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor(ws) {
			this.ws = ws
			this.data = []
		},
		get(id) {
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == id) {
					if (!this.data[i].complete) {
						var def = new Deferred()
						this.ws.getDetailedProject(id).then(lang.hitch(this, 'gotDetailedProject', def), lang.hitch(this, 'reportError', def))
						return def
					} else {
						return this.data[i]
					}
				}
			}
		},
		query(query) {
			var def = new Deferred()
			if (query.short) {
				this.ws.getListOfProjects().then(lang.hitch(this, 'gotListOfProjects', def), lang.hitch(this, 'reportError', def))
			} else {
				this.ws.getProjects().then(lang.hitch(this, 'gotProjects', def), lang.hitch(this, 'reportError', def))
			}
			return def
		},
		gotListOfProjects(def, list) {
			this.data = []
			for (var item in list) {
				this.data.push({
					id: item,
					name: list[item],
					complete: false
				})
			}
			def.resolve(this.data)
		},
		gotProjects(def, list) {
			def.resolve(list)
		},
		gotDetailedProject(def, proj) {
			proj.complete = true;
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == proj.id) {
					this.data[i] = proj
					def.resolve(this.data[i])
				}
			}
		},
		reportError(def) {
			def.reject('not found')
		}
	})
});
define('project/stores/devStore',['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor(ws) {
			this.ws = ws
			console.log(this.data)
		},
		get(id) {
			var def = new Deferred()
			this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError', def))
			return def
		},
		query(ids) {
			console.log('this is the devStore', this)
			this.data = []
			var def = new Deferred()

			for (var i = 0; i < ids.length; i++) {
				// var parentProject === proj ? proj : null
				this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def, ids.length), lang.hitch(this, 'reportError', def))
			}

			return def
		},
		add(dev) {
			console.log(dev)
			var def = new Deferred()
			this.ws.addDevelopment(dev).then(lang.hitch(this, 'devAdded', def), lang.hitch(this, 'reportError', def))
			return def
		},
		remove(projId, devId) {
			console.log(projId, devId)
			if (window.confirm('Voulez-vous vraiment supprimer ce développement ?')) {
				var def = new Deferred()
				this.ws.removeDevelopmentFromProject(projId, devId).then(lang.hitch(this, 'devDeleted', def), lang.hitch(this, 'reportError', def))
				return def
			}
		},
		gotDev(def, dev) {
			def.resolve(dev)
		},
		gotDevs(def, nb, dev) {
			this.data.push(dev)
			if (this.data.length === nb) {
				def.resolve(this.data)
			}
		},
		devAdded(def, res) {
			console.log(def.resolve(res))
			def.resolve(res)
		},
		devDeleted(def, dev) {
			console.log('Suppression du développement ', dev)
			def.resolve(dev)
		},
		reportError(def) {
			def.reject('not found')
		}
	})
});
define('project/stores/resourceStore',['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
  return declare(Store, {
    constructor: function (ws) {
      this.ws = ws
      this.data = null
    },
    get(id) {
      this.data = []
      var def = new Deferred()
      this.ws.getAResource(id).then(lang.hitch(this, 'gotDetailedResource', def), lang.hitch(this, 'reportError')).then(lang.hitch(this, 'getSkills', def), lang.hitch(this, 'reportError', def))
      return def
    },
    query() {
      var def = new Deferred()
      this.ws.getResources().then(lang.hitch(this, 'gotResources', def), lang.hitch(this, 'reportError', def))
      return def
    },
    put() {
      var def = new Deferred()
      this.ws.editResource().then(lang.hitch(this, 'resourceEdited', def), lang.hitch(this, 'reportError', def))
      return def
    },
    add(id, name, firstName) {
      var def = new Deferred()
      this.ws.addResource({
        id: id,
        name: name,
        firstName: firstName
      }).then(lang.hitch(this, 'resourceAdded', def), lang.hitch(this, 'reportError', def))
      return def
    },
    gotDetailedResource(def, res) {
      def.resolve(res)
    },
    gotResources(def, res) {
      def.resolve(res)
    },
    resourceAdded(def, res) {
      def.resolve(res)
    },
    reportError(def, res) {
      def.reject('not found')
    }
  })
});
define('project/stores/skillStore',['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
    return declare(Store, {
      constructor(ws) {
        this.ws = ws
        this.data = null
      },
      query() {
        var def = new Deferred()
        this.ws.getSkills().then(lang.hitch(this, 'gotSkills', def), lang.hitch(this, 'reportError'))
        return def
      },
      put() {
        var def = new Deferred()
        this.ws.editCustomer().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'))
        return def
      },
      add(id, data) {
        var def = new Deferred()
        this.ws.addSkill({
          id: id,
          name: data.name,
          parentSkillId: data.parentSkillId
        }).then(lang.hitch(this, 'skillAdded'), lang.hitch(this, 'reportError'))
        return def
      },
      gotSkills(def, res) {
        def.resolve(res)
      },
      modifiedSkill(def, res) {
        def.resolve(res)
      },
      skillAdded(def, res) {
        def.resolve(res)
      },
      reportError(def) {
        def.reject('not found')
      }
    })
  });
define('project/project',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'dojo/rpc/JsonService', 'project/stores/customerStore', 'project/stores/projectStore', 'project/stores/devStore', 'project/stores/resourceStore', 'project/stores/skillStore', 'dojo/when'],
	function (declare, topic, lang, JsonService, customerStore, projectStore, devStore, resourceStore, skillStore, when) {
		return declare(null, {
			constructor() {
				// this.connexion might change depending on your configuration and on your server

				// home-conf : 
				// this.connexion = new JsonService('http://192.168.0.44:8888/macro_planning/viewOnto/classes/dataset/ws-serv.php')

				// Stable local dump : 
				this.connexion = new JsonService('http://192.168.0.46/~pmbconfig/macro_planning/viewOnto/classes/dataset/ws-serv.php')

				// conf maxime Dev : 
				// this.connexion = new JsonService('http://192.168.0.80/mbeacco/macro_planning/viewOnto/classes/dataset/ws-serv.php')
				this.sliderProjects = []
				this.color = ''
				this.projectStore = new projectStore(this.connexion)
				this.devStore = new devStore(this.connexion)
				this.resourceStore = new resourceStore(this.connexion)
				this.customerStore = new customerStore(this.connexion)
				this.skillStore = new skillStore(this.connexion)
				this.getListOfProjects()
				this.getProjects()
				this.ids = []

				// Listeners

				topic.subscribe('saveDev', lang.hitch(this, 'submitNewDev'))
				topic.subscribe('addCustomer', lang.hitch(this, 'submitNewCustomer'))
				topic.subscribe('deleteDev', lang.hitch(this, 'deleteDev'))
				topic.subscribe('submitNewResource', lang.hitch(this, 'submitNewRes'))
				topic.subscribe('addProj', lang.hitch(this, 'submitNewProj'))
				topic.subscribe('getResources', lang.hitch(this, 'getResources'))
				topic.subscribe('getCustomers', lang.hitch(this, 'getCustomers'))
				topic.subscribe('refreshCustomers', lang.hitch(this, 'getCustomers'))
				topic.subscribe('openEditDev', lang.hitch(this, 'getDetailedDevelopment'))
				topic.subscribe('getDetailedProject', lang.hitch(this, 'getDetailedProject'))
				topic.subscribe('saveNewDev', lang.hitch(this, 'submitNewDev'))
				topic.subscribe('getSkills', lang.hitch(this, 'getSkills'))
				topic.subscribe('getDetailedResource', lang.hitch(this, 'getDetailedResource'))
				topic.subscribe('getHolidays', lang.hitch(this, 'getHolidays'))
			},
			getListOfProjects() {
				topic.publish('loading') // ici on met en place un petit loader pour indiquer que l'attente est normale
				when(this.projectStore.query({
						short: true
					}),
					lang.hitch(this, 'gotListOfProjects'),
					lang.hitch(this, 'reportError'))
			},
			getProjects() {
				topic.publish('loading')
				when(this.projectStore.query({
						short: false
					}),
					lang.hitch(this, 'gotFullProjects'),
					lang.hitch(this, 'reportError'))
			},
			gotListOfProjects(proj) {
				// topic.publish('loaded') // cet évènement indique que le chargement est terminé
				topic.publish('gotProjects', proj)
				// On rassemble les ids des projets dans un tableau pour pouvoir les réutiliser pour le getDetailedProject(idDuProjet)
				this.sliderWidth = 0
				for (var prop in proj) {
					this.ids.push(prop)
				}
				setTimeout(lang.hitch(this, function () {
					this.projectsInSlider = document.querySelectorAll('.project')
					for (var i = 0; i < this.projectsInSlider.length; i++) {
						this.projectsInSlider[i].nb = i // On ajoute la propriété
						this.sliderWidth += this.projectsInSlider[i].clientWidth + 8 // Pour ajouter la marge
					}
					document.getElementById('scroll_container').style = 'width: ' + (this.sliderWidth) + 'px;'
				}), 2500); // setTimeout pour laisser le temps au tableau ids de se construire, à remplacer par un callback
			},
			gotFullProjects(projects) {
				var developmentsToDraw = []
				for (var proj in projects) {
					for (var i = 0; i < projects[proj].developments.length; i++) {
						developmentsToDraw.push({
							dev: projects[proj].developments[i],
							fromProject: proj
						})
					}
				}
				this.retrieveDatesToDraw(developmentsToDraw)
			},
			retrieveDatesToDraw(devs) {
				var ids = []
				for (var i = 0; i < devs.length; i++) {
					for (var i = 0; i < devs.length; i++) {
						ids.push(devs[i].dev)
					}
					if (i === devs.length) {
						when(this.devStore.query(ids, devs.length), lang.hitch(this, 'drawOnGraph'), lang.hitch(this, 'reportError'))
					}
				}
			},
			drawOnGraph(devs) {
				this.tasks = []
				this.counter = 0

				for (var dev in devs) {
					this.tasks.push({})
					if (this.counter !== (devs.length - 1)) {
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
						this.counter++
					} else {
						topic.publish('drawProjects', this.tasks)
					}
				}

			},
			getDetailedProject(id) {
				topic.publish('loading')
				when(this.projectStore.get(id), lang.hitch(this, 'gotDetailedProject'), lang.hitch(this, 'reportError'))
			},
			gotDetailedProject(proj) {
				topic.publish('gotDetailedProject', proj)
				topic.publish('refreshDevs')
				this.developmentsIds = []
				for (var i = 0; i < proj.developments.length; i++) {
					this.developmentsIds.push(proj.developments[i])
				}
				when(this.devStore.query(proj.developments), lang.hitch(this, 'gotDevelopment'), lang.hitch(this, 'reportError'))
			},
			getDetailedDevelopment(devId) {
				when(this.devStore.get(devId), lang.hitch(this, 'gotDetailedDevelopment'), lang.hitch(this, 'reportError'))
			},
			gotDevelopment(dev) {
				topic.publish('gotDevelopment', dev)					
			},
			gotDetailedDevelopment(dev) {
				topic.publish('gotDetailedDevelopment', dev)
				topic.publish('loaded')
			},
			deleteDev(projId, devId) {
				when(this.devStore.remove(projId, devId), lang.hitch(this, 'devIsDeleted'), lang.hitch(this, 'reportError'))
			},
			devIsDeleted(dev) {
				// Mettre ici un modal, ou plutôt une simple notification en haut à droite de quelques secondes indiquant que le développement a bien été supprimé 
				console.log('Le développement suivant a bien été supprimé ', dev)
			},
			submitNewDev(dev) {
				// On aura besoin d'une vérification de la validité des données.
				console.log(dev)
				when(this.devStore.add(dev), lang.hitch(this, 'isAdded'), lang.hitch(this, 'reportError'))
			},
			submitNewRes(id, name, firstName) {
				// A revoir pour intégrer dans le store et non plus ici
				console.log('ajout d\'une ressource : ' + firstName + ' ' + name)
				this.connexion.addResource({
					"id": id,
					"name": name,
					"firstName": firstName
				}).then(lang.hitch(this, notify('success', 'Ajouté', '' + firstName + ' ' + name + ' a bien été ajouté aux ressources')), lang.hitch(this, 'reportError'))
			},
			submitNewProj(project) {
				// Impeccable, ça fonctionne, à remplacer par des données récupérées sur le serveur
				// this.project.addProject(project).then(lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))
				when(this.projectStore.add(project), lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))
				// this.project.addProject({
				//   "id":"",
				//   "name":"",
				//   "priority":"",
				//   "customerMind":{
				//     "customer":"",
				//     "mind":""
				//   },
				//   "developersMind":""
				// }).then(lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))
			},
			projAdded() {
				// On actualise la liste des projets après en avoir ajouté un pour qu'il apparaisse directement
				this.getListOfProjects()
			},
			getSkills() {
				when(this.skillStore.query(), lang.hitch(this, 'gotSkills'), lang.hitch(this, 'reportError'))
			},
			gotSkills(skills) {
				console.log(skills)
				topic.publish('gotSkills', skills)
			},
			isAdded(dev) {
				console.log('Développement ajouté (normalement)', dev)
			},
			getResources() {
				topic.publish('loading')
				when(this.resourceStore.query(), lang.hitch(this, 'gotResources'), lang.hitch(this, 'reportError'))
			},
			gotResources(resources) {
				topic.publish('gotResources', resources)
			},
			getDetailedResource(id) {
				when(this.resourceStore.get(id), lang.hitch(this, 'gotDetailedResource'), lang.hitch(this, 'reportError'))
			},
			gotDetailedResource(res) {
				console.log(res)
				res.holidays.forEach((item) => {
					this.getHolidays(item)
				})
				topic.publish('gotDetailedResource', res)
			},
			getHolidays(id) {
				this.connexion.getHolidays(id).then(lang.hitch(this, 'gotHolidays'), lang.hitch(this, 'reportError'))
			},
			gotHolidays (holidays) {
				topic.publish('gotHolidays', holidays)
				console.log(holidays)
			},
			getCustomers() {
				when(this.customerStore.query(), lang.hitch(this, 'gotCustomers'), lang.hitch(this, 'reportError'))
			},
			gotCustomers(customers) {
				topic.publish('gotCustomers', customers)
			},
			submitNewCustomer(id, data) {
				console.log(id, data)
				when(this.customerStore.add(id, data), lang.hitch(this, 'customerIsAdded'), lang.hitch(this, 'reportError'))
			},
			customerIsAdded(data) {
				console.log('test')
				console.log(data)
				topic.publish('notify', 'success', 'Client ajouté', 'Le client ' + data.firstName + ' ' + data.name + ' a bien été ajouté');			this.getCustomers()
			},
			notify(type, title, name) {
				topic.publish('notify', type, title, name)
			},
			reportError(err) {
				console.log(err)
				topic.publish('error')
			}
		})
	});
define('project/cli_webSocket',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang'], function (declare, topic, lang) {
  return declare(null, {
    constructor() {
      this.socket = io()
      topic.subscribe('openEdit', lang.hitch(this, 'emitEditing'))
      topic.subscribe('stopEdit', lang.hitch(this, 'stopEditing'))
      this.socket.on('blockEdit', lang.hitch(this, 'alertEditing'))
    },
    alertEditing(dev) {
      console.log(dev)
      console.log("quelqu'un edite deja")
      console.log('test')
      setTimeout(() => {
        topic.publish('closeEditModal')
      }, 20)
    },
    emitEditing(dev) {
      this.socket.emit('editing', dev)
    },
    stopEditing(dev) {
      this.socket.emit('stopEdit', dev)
    }
  })
});
define('project/vueComponent',['dojo/_base/declare'], function(declare) {
    return declare(null, {
        constructor (compName, template, data, methods, watch, mounted, computed, props, created, updated, extended, directives) {
            return Vue.component(compName, {
                template: template,
                data () {
                    return {
                        data: data
                    }
                },
                methods: methods,
                watch: watch,
                mounted: mounted,
                computed: computed,
                props: props,
                created: created,
                updated: updated,
                extends: extended,
                directives: directives
            });
        }
    });
});

define('project/components/customers',['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'],
	function (declare, lang, topic, vueComponent) {
		return declare(null, {
			constructor(compName) {
				this.compName = compName
				this.template = '#customers_tpl'
				this.data = {
					addCustomerIsOpen: false,
					customers: []
				}
				this.methods = {
					openAddCustomer(data) {
						this.data.addCustomerIsOpen = true
					},
					close() {
						this.data.addCustomerIsOpen = false
						window.scrollTo({
							left: 0,
							top: 0,
							behavior: 'smooth'
						  })
					}
				}
				this.created = function () {
					topic.publish('getCustomers')
				}
				this.createComponent()
				topic.subscribe('gotCustomers', lang.hitch(this, 'showCustomers'))
			},
			showCustomers(customers) {
				this.data.customers = customers
			},
			closeAddCustomer() {
				this.data.addCustomerIsOpen = false
			},
			createComponent() {
				this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
			}
		})
	});
define('project/components/affProjectList',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) { // affProject ne prend que l'élément en argument
      this.compName = compName
      this.template = '#projects_tpl'
      this.data = {
        project: {},
        notification: '',
        isOpen: false
      }
      this.methods = {
        open() {
          this.data.isOpen = true
        },
        close() {
          this.data.isOpen = false
        },
        sumbitProj() {
          topic.publish('addProj', this.data.project)
        },
        openProject(id) {
          topic.publish('getDetailedProject', id)
          this.$parent.$emit('changeView', this.$root.lastView, 'detailedProject')
        }
      }
      this.createComponent()
      topic.subscribe('gotProjects', lang.hitch(this, 'displayProj'))
      topic.subscribe('error', lang.hitch(this, 'alertError'))
    },
    displayProj(proj) {
      this.data.project = proj
    },
    alertError() {
      this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.'
      setTimeout(lang.hitch(this, function() {
        this.data.notification = ''
      }), 2800)
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})
;
define('project/components/calendar',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
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
});
define('project/components/menu',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor: function (compName) {
            this.compName = compName
            this.template = '#menu_tpl'
            this.data = {
                // TODO : pouvoir mettre les éléments du menu ici et plus dans le html
                active: '',
                lastView: '',
                currentView: '',
                menu: [{
                    name: 'Développements',
                    path: 'detailedProject'
                }, {
                    name: 'Ressources',
                    path: 'resources'
                }, {
                    name: 'Infos pratiques',
                    path: 'infos'
                }, {
                    name: 'Clients',
                    path: 'customers'
                }, {
                    name: 'Paramètres',
                    path: 'settings',
                    icon: 'cog'
                }] // A recupérer autrement ?
            };
            this.methods = {
                toggleMenu() {
                    document.getElementById('burger').classList.toggle('is-open')
                },
                changeView(lastView, url) {
                    console.log(url)
                    window.history.pushState(null, null, url)
                    this.data.currentView = window.location.pathname.slice(1)
                    this.data.lastView = lastView
                    this.data.active = url
                    this.$parent.$emit('changeView', lastView, url)
                },
                back(lastView) {
                    this.changeView(lastView, this.data.lastView)
                },
            }
            this.mounted = function () {
                console.log()
            }
            this.created = function () {
                this.data.currentView = window.location.pathname.slice(1)                
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
        }
    });
});
define('project/components/affDetailedProject',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor(compName) { // affProject ne prend que l'élément en argument
			this.compName = compName
			this.template = '#detailed_project'
			// on initialise le data utilisé pour qu'il soit rendu dans la vue même s'il n'est pas encore rempli
			this.data = {
				isOpen: false,
				detailedProject: {
					name: '',
					developments: [],
					developersMind: {}
				},
				notification: ''
			}
			this.methods = {
				open() {
					topic.publish('getSkills')
					topic.publish('openAddDev')
					this.data.isOpen = true
				},
				orderByAZ() {
					this.data.detailedProject.developments.sort(lang.hitch(this, this.$root.alpha));
				},
				orderByDate() {
					// ne marche pas pour le moment
					this.data.detailedProject.developments.sort(lang.hitch(this, this.$root.date))
				},
				close() {
					window.scrollTo({
						top:0,
						left:0,
						behavior: 'smooth'
					})
					this.data.isOpen = false
				}
			}
			this.createComponent()
			topic.subscribe('gotDetailedProject', lang.hitch(this, 'displayExpProj'))
			topic.subscribe('error', lang.hitch(this, 'alertError'))
		},
		displayExpProj(proj) {
			this.data.detailedProject = proj
			setTimeout(topic.publish('loaded'), 200)
		},
		alertError() {
			this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.'
			setTimeout(lang.hitch(this, function () {
				this.data.notification = ''
			}), 3500)
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
		}
	});
});
define('project/components/development',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
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
});
define('project/components/resources',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      this.template = '#resource-tpl'
      this.data = {
        isOpen: false,
        addIsOpen: false,
        resources: {}
      }
      this.methods = {
        openAddRes() {
          // topic.publish('openAddRes')
          this.data.addIsOpen = true
        },
        close () {
          this.data.isOpen = false
          this.data.addIsOpen = false
					window.scrollTo({
						top:0,
						left:0,
						behavior: 'smooth'
					})
        },
        editRes(id) {
          this.data.isOpen = true
          topic.publish('editRes')
        },
        getDetailedResource(id) {
          this.data.isOpen = true
          topic.publish('getDetailedResource', id)
          // topic.publish('getSkills')
        }
      }
      this.createComponent()
      topic.subscribe('gotResources', lang.hitch(this, 'showResources'))
    },
    showResources(resources) {
      this.data.resources = resources
    },
    getHolidays(e) {
      // for (var i = 0; i < this.data.resources.length; i++) {
      //   for (var i = 0; i < this.data.resources.length; i++) {
      //     topic.publish(e.target.id)
      //   }
      // }
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  })
})
;
define('project/components/modals/detailedResource',['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
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
});
define('project/components/modals/addProject',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-project'
            this.props = ['isOpen']
            this.data = {
                project: {
                    id: '',
                    priority: '',
                    customerSpirit: {
                        client: '',
                        spirit: '',
                    },
                    developersSpirit: ''
                }
            }
            this.methods = {

            }
            this.computed = {
                _isOpen() {
                    return this.$props.isOpen
                }
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
define('project/components/modals/addResource',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-res-tpl'
            this.data = {
                isOpen: false,
                addIsOpen: false,
                id: '',
                name: '',
                firstName: ''
            }
            this.props = ['isOpen']
            this.computed = {
                id () {
                    return this.data.firstName.slice(0, 1) + this.data.name
                },
                _isOpen () {
                    return this.$props.isOpen
                }
            }
            this.methods = {
                close () {
                    console.log(this.id)
                },
                submitResource () {
                    topic.publish('submitNewResource', this.id, this.name, this.firstName)
                }
            }
            this.updated = function () {
                window.scrollTo({
                    left: 0,
                    top: 640,
                    behavior: 'smooth'
                  })
            }
            topic.subscribe('openAddRes', lang.hitch(this, 'open'))
            topic.subscribe('closeModal', lang.hitch(this, 'close'))
            topic.subscribe('gotSkills', lang.hitch(this, 'populate'))
            this.createComponent()
        },
        open () {
            topic.publish('getSkills')
            this.data.isOpen = true
        },
        close () {
            this.data.isOpen = false
        },
        populate (skills) {
            this.data.allSkills = skills
        },
        createComponent () {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
define('project/components/modals/addNewDev',['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
  return declare(null, {
    constructor(compName) {
      this.compName = compName
      topic.subscribe('gotSkills', lang.hitch(this, this.populate))
      this.template = '#add-dev-tpl'
      this.data = {
        dev: {
          "id": "",
          "name": "",
          "earlyStart": null,
          "lateStart": null,
          "realStart": null,
          "plannedStart": null,
          "earlyEnd": null,
          "lateEnd": null,
          "realEnd": null,
          "plannedEnd": null,
          "status": 0,
          "priority": "",
          "optional": false,
          "effort": 0,
          "skillTags": [],
          "project": ""
        },
        allSkills: [],
        showRes: false
      }
      this.props = ['isOpen']
      this.methods = {
        submitNewDev(dev, projId) {
          console.log(projId, ' will receive this dev :')
          console.log(dev) // TODO: Trouver pourquoi le publish ne veut pas envoyer le dev
          this.dev = 
          topic.publish('saveDev', dev)
        }
      }
      this.computed = {
        _isOpen () {
          return this.$props.isOpen
        }
      }
      topic.subscribe('gotProjects', lang.hitch(this, 'populateProjects'))
      this.createComponent()
    },
    populate (skills) {
      this.data.allSkills = skills
      window.scrollTo({
        left: 0,
        top: 540,
        behavior: 'smooth'
      })
    },
    populateProjects (projects) {
      this.data.allProjects = projects 
    },
    createComponent () {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
    }
  });
});
define('project/components/modals/editDev',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
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
		populateResources(resource) {
			this.data.resource
			window.scrollTo({
				left: 0,
				top: 540,
				behavior: 'smooth'
			  })
		},
		populate(dev) {
			this.data.dev = dev
		},
		createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
		}
	})
});
define('project/components/eventLoad',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function(declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor (compName) {
            this.compName = compName
            this.data = {
                isLoading: true
            }
            this.template = '#load_tpl'
            topic.subscribe('ganttRendered', lang.hitch(this, 'loaded'))
            topic.subscribe('error', function(){console.log('err')})     
            this.createComponent()
        },
        loaded () {
            console.log('ganttRendered')
            this.data.isLoading = false
        },
        createComponent () {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended)
        }
    });
});

define('project/components/modal',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#modal-tpl'
            this.data = {
                formData: {
                    
                }
            }
            this.methods = {

            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
define('project/components/modals/addCustomer',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-customer-tpl'
            this.props = ['isOpen']
            this.data = {
                formContent: {
                    name: '',
                    firstName: ''
                }
            }
            this.methods = {
                addCustomer(id, data) {
                    topic.publish('addCustomer', id, data)
                    topic.publish('refreshCustomers')
                    this.$emit('close')
                }
            }
            this.computed = {
                generateId() {
                    return this.data.formContent.firstName.slice(0,1) + this.data.formContent.name
                },
                _isOpen() {
                    return this.$props.isOpen
                }
            }
            this.updated = function () {
                window.scrollTo({
                    left: 0,
                    top: 640,
                    behavior: 'smooth'
                  })
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
define('project/components/settings',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_settings'
            this.data = {
                settings: [
                    {
                        type: 'checkbox',
                        label: 'Afficher les indisponibilités sur le calendrier',
                        id: 'showHolidaysOnGantt',
                        value: false
                    },
                    {
                        type: 'color',
                        label: 'Couleur de la barre de navigation',
                        id: 'pickColor',
                        value: '#454545'
                    },
                    {
                        type: 'text',
                        label: 'Nom d\'utilisateur',
                        id: 'username',
                        value: ''
                    }
                ]
            }
            this.methods = {

            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
define('project/components/notification',['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#notification-tpl'
            this.data = {
                visible: false,
                type: '',
                title: '',
                message: ''
            }
            this.methods = {

            }
            topic.subscribe('notify', lang.hitch(this, 'showNotification'))
            this.createComponent()
        },
        showNotification(type, title, message) {
            this.data.tit = title
            this.data.typ = type
            this.data.message = message
            this.data.visible = true
            setTimeout(() => {
                this.data.visible = false
            }, 3000)
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
});
require(['project/project', 'project/cli_webSocket', 'dojo/_base/lang', 'dojo/topic', 'project/components/customers', 'project/components/affProjectList', 'project/components/calendar', 'project/components/menu', 'project/components/affDetailedProject', 'project/components/development', 'project/components/resources', 'project/components/modals/detailedResource', 'project/components/modals/addProject', 'project/components/modals/addResource', 'project/components/modals/addNewDev', 'project/components/modals/editDev', 'project/components/eventLoad', 'project/components/modal', 'project/components/modals/addCustomer', 'project/components/settings', 'project/components/notification', 'dojo/ready'],
	function (project, webSocket, lang, topic, customers, affProjectList, calendar, menu, affDetailedProject, development, resources, detailedResource, addProject, addResource, addNewDev, editDev, eventLoad, Modal, addCustomer, settings, notification, ready) {
		ready(function () {
			var call = new project() // nouvel appel Json RPC
			var socket = new webSocket()
			var projList = new affProjectList('projects') // nouveau component qui gère la liste des projets
			var _modal = new Modal('modal')
			var leMenu = new menu('leMenu')
			var _calendar = new calendar('calendar')
			var loadWatcher = new eventLoad('loader') // Surveille les évènements et donc le chargement des données demandées
			var detailedProject = new affDetailedProject('detailedProject')
			var _resources = new resources('resources')
			var detailedRes = new detailedResource('detailedRes')
			var _addResource = new addResource('addResource')
			var modalAdd = new addNewDev('addDev')
			var dev = new development('development')
			var modalEdit = new editDev('editDev')
			var _addProject = new addProject('addProject')
			var _addClient = new addCustomer('addCustomer')
			var customersPanel = new customers('customers')
			var _settings = new settings('settings')
			var _notification = new notification('notification')
			new Vue({
				el: '#app',
				data: {
					currentView: '',
					lastView: '',
					isLoading: false,
					addDevIsOpen: false,
					addCustomerIsOpen: false,
					editDevIsOpen: false,
					formData: {}
				},
				methods: {
					close() {
						document.getElementById('burger').classList.remove('is-open')
					},
					change() {
						console.log('goto event')
					},
					alpha(a, b) {
						if (a.name < b.name)
							return -1;
						if (a.name > b.name)
							return 1;
						return 0;
					},
					date(a, b) {
						if (a.date < b.date)
							return -1
						if (a.date > b.date)
							return 1
						return 0
					}
				},
				created() {
					// Fonction appelée à la création de la vue
					topic.publish('getResources')
				},
				mounted() {
					this.currentView = window.location.pathname.slice(1)					
					this.$on('changeView', function(lastView, currentView) {
						window.history.pushState(null, null, currentView)
						this.currentView = currentView
						this.lastView = lastView
					})
				},
				updated() {
					topic.publish('useTemplate')
				}
			});
		});
	});
define("public/js/project/dojorpc", function(){});

