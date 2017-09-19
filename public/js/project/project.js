define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'dojo/rpc/JsonService', 'project/stores/customerStore', 'project/stores/projectStore', 'project/stores/devStore', 'project/stores/resourceStore', 'project/stores/skillStore', 'dojo/when'],
	function (declare, topic, lang, JsonService, customerStore, projectStore, devStore, resourceStore, skillStore, when) {
		return declare(null, {
			constructor() {
				// this.connexion might need a change depending on your configuration and on your server
				this.connexion = new JsonService('http://192.168.0.46/~pmbconfig/macro_planning/viewOnto/classes/dataset/ws-serv.php')

				// Initializations
				this.sliderProjects = []
				this.color = ''
				this.ids = []				

				// Stores
				this.projectStore = new projectStore(this.connexion)
				this.devStore = new devStore(this.connexion)
				this.resourceStore = new resourceStore(this.connexion)
				this.customerStore = new customerStore(this.connexion)
				this.skillStore = new skillStore(this.connexion)

				// Functions to be launched at start
				this.getListOfProjects()
				this.getProjects()

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
				console.log('suppression du développement', dev)
				console.log('______________')
				console.log('rechargement des développements')
			},
			submitNewDev(dev) {
				// On aura besoin d'une vérification de la validité des données.
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
	})