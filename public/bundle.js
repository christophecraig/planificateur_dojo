'use strict';

define('project/stores/customerStore', ['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor: function constructor(ws) {
			this.ws = ws;
			this.data = null;
		},
		query: function query() {
			var def = new Deferred();
			this.ws.getCustomers().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'));
			return def;
		},
		put: function put() {
			var def = new Deferred();
			this.ws.editCustomer().then(lang.hitch(this, 'gotCustomers', def), lang.hitch(this, 'reportError'));
			return def;
		},
		add: function add(id, data) {
			var def = new Deferred();
			this.ws.addCustomer({
				id: id,
				name: data.name,
				firstName: data.firstName
			}).then(lang.hitch(this, 'customerAdded'), lang.hitch(this, 'reportError'));
			return def;
		},
		gotCustomers: function gotCustomers(def, res) {
			def.resolve(res);
		},
		customerAdded: function customerAdded(def, res) {
			def.resolve(res);
		},
		reportError: function reportError(def) {
			def.reject('not found');
		}
	});
});
define('project/stores/projectStore', ['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor: function constructor(ws) {
			this.ws = ws;
			this.data = [];
		},
		get: function get(id) {
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == id) {
					if (!this.data[i].complete) {
						var def = new Deferred();
						this.ws.getDetailedProject(id).then(lang.hitch(this, 'gotDetailedProject', def), lang.hitch(this, 'reportError', def));
						return def;
					} else {
						return this.data[i];
					}
				}
			}
		},
		query: function query(_query) {
			var def = new Deferred();
			if (_query.short) {
				this.ws.getListOfProjects().then(lang.hitch(this, 'gotListOfProjects', def), lang.hitch(this, 'reportError', def));
			} else {
				this.ws.getProjects().then(lang.hitch(this, 'gotProjects', def), lang.hitch(this, 'reportError', def));
			}
			return def;
		},
		gotListOfProjects: function gotListOfProjects(def, list) {
			this.data = [];
			for (var item in list) {
				this.data.push({
					id: item,
					name: list[item],
					complete: false
				});
			}
			def.resolve(this.data);
		},
		gotProjects: function gotProjects(def, list) {
			def.resolve(list);
		},
		gotDetailedProject: function gotDetailedProject(def, proj) {
			proj.complete = true;
			for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].id == proj.id) {
					this.data[i] = proj;
					def.resolve(this.data[i]);
				}
			}
		},
		reportError: function reportError(def) {
			def.reject('not found');
		}
	});
});
define('project/stores/devStore', ['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor: function constructor(ws) {
			this.ws = ws;
			console.log(this);
		},
		get: function get(id) {
			var def = new Deferred();
			this.ws.getDetailedDevelopment(id).then(lang.hitch(this, 'gotDev', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		query: function query(ids) {
			this.data = [];
			var def = new Deferred();

			for (var i = 0; i < ids.length; i++) {
				// var parentProject === proj ? proj : null
				this.ws.getDetailedDevelopment(ids[i]).then(lang.hitch(this, 'gotDevs', def, ids.length), lang.hitch(this, 'reportError', def));
			}

			return def;
		},
		add: function add(dev) {
			var def = new Deferred();
			this.ws.addDevelopment(dev).then(lang.hitch(this, 'devAdded', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		remove: function remove(dev, property) {
			console.log(dev, property);
			if (window.confirm('Voulez-vous vraiment supprimer ce développement ?')) {
				var def = new Deferred();
				this.ws.deleteSomething(dev, property).then(lang.hitch(this, 'devDeleted', def), lang.hitch(this, 'reportError', def));
				return def;
			}
		},
		gotDev: function gotDev(def, dev) {
			def.resolve(dev);
		},
		gotDevs: function gotDevs(def, nb, dev) {
			this.data.push(dev);
			if (this.data.length === nb) {
				def.resolve(this.data);
			}
		},
		devAdded: function devAdded(def, dev) {
			console.log('et on ajoute ceci', dev);
			def.resolve(dev);
		},
		devDeleted: function devDeleted(def, dev) {
			console.log('Suppression du développement ', dev);
			def.resolve(dev);
		},
		reportError: function reportError(def) {
			def.reject('not found');
		}
	});
});
define('project/stores/resourceStore', ['dojo/_base/declare', 'dojo/store/api/Store', 'dojo/Deferred', 'dojo/_base/lang'], function (declare, Store, Deferred, lang) {
	return declare(Store, {
		constructor: function constructor(ws) {
			this.ws = ws;
			this.data = null;
		},
		get: function get(id) {
			this.data = [];
			var def = new Deferred();
			this.ws.getAResource(id).then(lang.hitch(this, 'gotDetailedResource', def), lang.hitch(this, 'reportError')).then(lang.hitch(this, 'getSkills', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		query: function query() {
			var def = new Deferred();
			this.ws.getResources().then(lang.hitch(this, 'gotResources', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		put: function put() {
			var def = new Deferred();
			this.ws.editResource().then(lang.hitch(this, 'resourceEdited', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		add: function add(id, name, firstName) {
			var def = new Deferred();
			this.ws.addResource({
				id: id,
				name: name,
				firstName: firstName
			}).then(lang.hitch(this, 'resourceAdded', def), lang.hitch(this, 'reportError', def));
			return def;
		},
		gotDetailedResource: function gotDetailedResource(def, res) {
			def.resolve(res);
		},
		gotResources: function gotResources(def, res) {
			def.resolve(res);
		},
		resourceAdded: function resourceAdded(def, res) {
			def.resolve(res);
		},
		reportError: function reportError(def, res) {
			def.reject('not found');
		}
	});
});
define('project/project', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'dojo/rpc/JsonService', 'project/stores/customerStore', 'project/stores/projectStore', 'project/stores/devStore', 'project/stores/resourceStore', 'dojo/when'], function (declare, topic, lang, JsonService, customerStore, projectStore, devStore, resourceStore, when) {
	return declare(null, {
		constructor: function constructor() {
			// this.connexion might change depending on your configuration and on your server

			// home-conf : 
			// this.connexion = new JsonService('http://192.168.0.44:8888/macro_planning/viewOnto/classes/dataset/ws-serv.php')

			// Stable unfinished work-conf : 
			// this.connexion = new JsonService('http://192.168.0.46/~pmbconfig/macro_planning/viewOnto/classes/dataset/ws-serv.php')

			// conf maxime Dev : 
			this.connexion = new JsonService('http://192.168.0.80/mbeacco/macro_planning/viewOnto/classes/dataset/ws-serv.php');
			this.sliderProjects = [];
			this.color = '';
			this.projectStore = new projectStore(this.connexion);
			this.devStore = new devStore(this.connexion);
			this.resourceStore = new resourceStore(this.connexion);
			this.customerStore = new customerStore(this.connexion);
			this.getListOfProjects();
			this.getProjects();
			this.ids = [];

			// Listeners

			topic.subscribe('saveDev', lang.hitch(this, 'submitNewDev'));
			topic.subscribe('addCustomer', lang.hitch(this, 'submitNewCustomer'));
			topic.subscribe('deleteDev', lang.hitch(this, 'deleteDev'));
			topic.subscribe('submitNewResource', lang.hitch(this, 'submitNewRes'));
			topic.subscribe('addProj', lang.hitch(this, 'submitNewProj'));
			topic.subscribe('getResources', lang.hitch(this, 'getResources'));
			topic.subscribe('getCustomers', lang.hitch(this, 'getCustomers'));
			topic.subscribe('refreshCustomers', lang.hitch(this, 'getCustomers'));
			topic.subscribe('openEditDev', lang.hitch(this, 'getDetailedDevelopment'));
			topic.subscribe('getDetailedProject', lang.hitch(this, 'getDetailedProject'));
			topic.subscribe('saveNewDev', lang.hitch(this, 'submitNewDev'));
			topic.subscribe('getSkills', lang.hitch(this, 'getSkills'));
			topic.subscribe('getDetailedResource', lang.hitch(this, 'getDetailedResource'));
		},
		getListOfProjects: function getListOfProjects() {
			topic.publish('loading'); // ici on met en place un petit loader pour indiquer que l'attente est normale
			when(this.projectStore.query({
				short: true
			}), lang.hitch(this, 'gotListOfProjects'), lang.hitch(this, 'reportError'));
		},
		getProjects: function getProjects() {
			topic.publish('loading');
			when(this.projectStore.query({
				short: false
			}), lang.hitch(this, 'gotFullProjects'), lang.hitch(this, 'reportError'));
		},
		gotListOfProjects: function gotListOfProjects(proj) {
			// topic.publish('loaded') // cet évènement indique que le chargement est terminé
			topic.publish('gotProjects', proj);
			// On rassemble les ids des projets dans un tableau pour pouvoir les réutiliser pour le getDetailedProject(idDuProjet)
			this.sliderWidth = 0;
			for (var prop in proj) {
				this.ids.push(prop);
			}
			setTimeout(lang.hitch(this, function () {
				this.projectsInSlider = document.querySelectorAll('.project');
				for (var i = 0; i < this.projectsInSlider.length; i++) {
					this.projectsInSlider[i].nb = i; // On ajoute la propriété
					this.sliderWidth += this.projectsInSlider[i].clientWidth + 8; // Pour ajouter la marge
				}
				document.getElementById('scroll_container').style = 'width: ' + this.sliderWidth + 'px;';
			}), 2500); // setTimeout pour laisser le temps au tableau ids de se construire, à remplacer par un callback
		},
		gotFullProjects: function gotFullProjects(projects) {
			var developmentsToDraw = [];
			for (var proj in projects) {
				for (var i = 0; i < projects[proj].developments.length; i++) {
					developmentsToDraw.push({
						dev: projects[proj].developments[i],
						fromProject: proj
					});
				}
			}
			this.retrieveDatesToDraw(developmentsToDraw);
		},
		retrieveDatesToDraw: function retrieveDatesToDraw(devs) {
			console.log(devs);
			var ids = [];
			for (var i = 0; i < devs.length; i++) {
				for (var i = 0; i < devs.length; i++) {
					ids.push(devs[i].dev);
				}
				if (i === devs.length) {
					when(this.devStore.query(ids, devs.length), lang.hitch(this, 'drawOnGraph'), lang.hitch(this, 'reportError'));
				}
			}
		},
		drawOnGraph: function drawOnGraph(devs) {
			console.log(devs);

			this.tasks = [];
			this.counter = 0;

			for (var dev in devs) {
				this.tasks.push({});
				if (this.counter !== devs.length - 1) {
					for (var prop in devs[dev]) {
						if (devs[dev][prop] !== null) {
							switch (prop) {
								case 'earlyStart':
								case 'plannedStart':
								case 'realStart':
								case 'lateStart':
									this.tasks[dev].start = devs[dev][prop];
									break;
								case 'earlyEnd':
								case 'plannedEnd':
								case 'realEnd':
								case 'lateEnd':
									this.tasks[dev].end = devs[dev][prop];
									break;
								case 'id':
									this.tasks[dev].id = devs[dev][prop];
									break;
								case 'name':
									this.tasks[dev].name = devs[dev][prop];
									break;
								case 'effort':
									this.tasks[dev].progress = devs[dev][prop];
									break;
							}
						}
					}
					this.counter++;
				} else {
					topic.publish('drawProjects', this.tasks);
				}
			}
		},
		getDetailedProject: function getDetailedProject(id) {
			topic.publish('loading');
			when(this.projectStore.get(id), lang.hitch(this, 'gotDetailedProject'), lang.hitch(this, 'reportError'));
		},
		gotDetailedProject: function gotDetailedProject(proj) {
			topic.publish('gotDetailedProject', proj);
			topic.publish('refreshDevs');
			this.developmentsIds = [];
			for (var i = 0; i < proj.developments.length; i++) {
				this.developmentsIds.push(proj.developments[i]);
			}
			when(this.devStore.query(proj.developments), lang.hitch(this, 'gotDevelopment'), lang.hitch(this, 'reportError'));
		},
		getDetailedDevelopment: function getDetailedDevelopment(devId) {
			when(this.devStore.get(devId), lang.hitch(this, 'gotDetailedDevelopment'), lang.hitch(this, 'reportError'));
		},
		gotDevelopment: function gotDevelopment(dev) {
			topic.publish('gotDevelopment', dev);
		},
		gotDetailedDevelopment: function gotDetailedDevelopment(dev) {
			topic.publish('gotDetailedDevelopment', dev);
			topic.publish('loaded');
		},
		deleteDev: function deleteDev(dev, property) {
			console.log('évnènement bien reçu sur project.js ', dev);
			when(this.devStore.remove(dev, property), lang.hitch(this, 'devIsDeleted'), lang.hitch(this, 'reportError'));
		},
		devIsDeleted: function devIsDeleted(dev) {
			// Mettre ici un modal, ou plutôt une simple notification en haut à droite de quelques secondes indiquant que le développement a bien été supprimé 
			console.log('Le développement suivant a bien été supprimé ', dev);
		},
		submitNewDev: function submitNewDev(dev) {
			// On aura besoin d'une vérification de la validité des données.
			console.log(dev);
			when(this.devStore.add(dev), lang.hitch(this, 'isAdded'), lang.hitch(this, 'reportError'));
		},
		submitNewRes: function submitNewRes(id, name, firstName) {
			// A revoir pour intégrer dans le store et non plus ici
			console.log('ajout d\'une ressource : ' + firstName + ' ' + name);
			this.connexion.addResource({
				"id": id,
				"name": name,
				"firstName": firstName
			}).then(lang.hitch(this, notify('success', 'Ajouté', '' + firstName + ' ' + name + ' a bien été ajouté aux ressources')), lang.hitch(this, 'reportError'));
		},
		submitNewProj: function submitNewProj(project) {
			// Impeccable, ça fonctionne, à remplacer par des données récupérées sur le serveur
			// this.project.addProject(project).then(lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))
			when(this.projectStore.add(project), lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'));
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
		projAdded: function projAdded() {
			// On actualise la liste des projets après en avoir ajouté un pour qu'il apparaisse directement
			this.getListOfProjects();
		},
		getSkills: function getSkills() {
			this.connexion.getSkills().then(lang.hitch(this, 'gotSkills'), lang.hitch(this, 'reportError'));
		},
		gotSkills: function gotSkills(skills) {
			console.log(skills);
			topic.publish('gotSkills', skills);
		},
		isAdded: function isAdded() {
			console.log('Développement ajouté (normalement)');
		},
		getResources: function getResources() {
			topic.publish('loading');
			when(this.resourceStore.query(), lang.hitch(this, 'gotResources'), lang.hitch(this, 'reportError'));
		},
		gotResources: function gotResources(resources) {
			topic.publish('gotResources', resources);
		},
		getDetailedResource: function getDetailedResource(id) {
			when(this.resourceStore.get(id), lang.hitch(this, 'gotDetailedResource'), lang.hitch(this, 'reportError'));
		},
		gotDetailedResource: function gotDetailedResource(res) {
			topic.publish('gotDetailedResource', res);
		},
		getCustomers: function getCustomers() {
			when(this.customerStore.query(), lang.hitch(this, 'gotCustomers'), lang.hitch(this, 'reportError'));
		},
		gotCustomers: function gotCustomers(customers) {
			topic.publish('gotCustomers', customers);
		},
		submitNewCustomer: function submitNewCustomer(id, data) {
			console.log(id, data);
			when(this.customerStore.add(id, data), lang.hitch(this, 'customerIsAdded'), lang.hitch(this, 'reportError'));
		},
		customerIsAdded: function customerIsAdded(data) {
			console.log('test');
			console.log(data);
			topic.publish('notifyCustomerAdded');
			this.getCustomers();
		},
		notify: function notify(type, title, name) {
			topic.publish('notify', type, title, name);
		},
		reportError: function reportError(err) {
			console.log(err);
			topic.publish('error');
		}
	});
});
define('project/cli_webSocket', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang'], function (declare, topic, lang) {
	return declare(null, {
		constructor: function constructor() {
			this.socket = io();
			topic.subscribe('openEdit', lang.hitch(this, 'emitEditing'));
			topic.subscribe('stopEdit', lang.hitch(this, 'stopEditing'));
			this.socket.on('blockEdit', lang.hitch(this, 'alertEditing'));
		},
		alertEditing: function alertEditing(dev) {
			console.log(dev);
			console.log("quelqu'un edite deja");
			console.log('test');
			setTimeout(function () {
				topic.publish('closeEditModal');
			}, 20);
		},
		emitEditing: function emitEditing(dev) {
			this.socket.emit('editing', dev);
		},
		stopEditing: function stopEditing(dev) {
			this.socket.emit('stopEdit', dev);
		}
	});
});
define('project/vueComponent', ['dojo/_base/declare'], function (declare) {
	return declare(null, {
		constructor: function constructor(compName, template, _data, methods, watch, mounted, computed, props, created, updated, extended, directives) {
			return Vue.component(compName, {
				template: template,
				data: function data() {
					return {
						data: _data
					};
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

define('project/components/customers', ['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#customers_tpl';
			this.data = {
				addCustomerIsOpen: false,
				customers: []
			};
			this.methods = {
				openAddCustomer: function openAddCustomer(data) {
					this.data.addCustomerIsOpen = true;
				}
			};
			this.created = function () {
				topic.publish('getCustomers');
			};
			this.createComponent();
			topic.subscribe('closeModal', lang.hitch(this, 'closeAddCustomer'));
			topic.subscribe('gotCustomers', lang.hitch(this, 'showCustomers'));
		},
		showCustomers: function showCustomers(customers) {
			this.data.customers = customers;
		},
		closeAddCustomer: function closeAddCustomer() {
			this.data.addCustomerIsOpen = false;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/affProjectList', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			// affProject ne prend que l'élément en argument
			this.compName = compName;
			this.template = '#projects_tpl';
			this.data = {
				project: {},
				notification: '',
				modalIsOpen: false
			};
			this.methods = {
				openModal: function openModal() {
					this.data.modalIsOpen = true;
				},
				addProj: function addProj() {
					topic.publish('addProj');
				},
				openProject: function openProject(id) {
					topic.publish('getDetailedProject', id);
					this.$root.changeView(this.$root.currentView, './detailedProject');
				}
			};
			this.createComponent();
			topic.subscribe('gotProjects', lang.hitch(this, 'displayProj'));
			topic.subscribe('error', lang.hitch(this, 'alertError'));
		},
		displayProj: function displayProj(proj) {
			this.data.project = proj;
		},
		alertError: function alertError() {
			this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.';
			setTimeout(lang.hitch(this, function () {
				this.data.notification = '';
			}), 2800);
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/calendar', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#calendar_tpl';
			this.data = {
				devs: {},
				fromProject: ''
			};
			this.createComponent();
			topic.subscribe('drawProjects', lang.hitch(this, 'drawProjects'));
		},
		drawProjects: function drawProjects(devs) {
			topic.publish('ganttLoaded', devs);
		},
		getColor: function getColor(idProj) {
			switch (idProj) {
				case '':
					return;
					break;
			}
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extends);
		}
	});
});
define('project/components/tasks', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#_task';
			this.data = {
				devs: {}
			};
			this.level = 3;
			this.levels = ['Month', 'Week', 'Day', 'Half Day', 'Quarter Day'];
			topic.subscribe('highlightRelated', lang.hitch(this, 'applyClass')); // doesn't exist yet, goal is to highlight the project in the calendar when we hover it in the developments view
			topic.subscribe('ganttLoaded', lang.hitch(this, 'storeDevs'));
			this.createComponent();
		},
		storeDevs: function storeDevs(devs) {
			console.log('ganttLoaded');
			moment.locale('fr');
			this.__gantt = new Gantt('#gantt', devs, {
				on_date_change: function on_date_change(task, start, end) {
					console.log(task, start, end);
				},
				on_progress_change: function on_progress_change(task, progress) {
					console.log(task, progress);
				},
				on_view_change: function on_view_change(mode) {
					console.log(mode);
					topic.publish('ganttRendered');
				}
			});
			document.getElementById('zoom-in').addEventListener('click', lang.hitch(this, 'setZoomLevel', 1));
			document.getElementById('zoom-out').addEventListener('click', lang.hitch(this, 'setZoomLevel', 0));
			this.expanded = false;
			document.getElementById('expand').addEventListener('click', lang.hitch(this, 'expandGantt'));
		},
		expandGantt: function expandGantt() {
			if (!this.expanded) {
				document.getElementById('calendar').style = 'height:' + (window.innerHeight - 78) + 'px';
				document.getElementById('expand').classList.add('fa-compress');
				this.expanded = true;
			} else {
				document.getElementById('calendar').style = 'height: 540px';
				document.getElementById('expand').classList.remove('fa-compress');
				this.expanded = false;
			}
		},
		setZoomLevel: function setZoomLevel(arg) {
			if (arg === 1) {
				if (this.level < 4) {
					this.level++;
					return this.__gantt.change_view_mode(this.levels[this.level]);
				}
			}
			if (arg === 0) {
				if (this.level > 0) {
					this.level--;
					return this.__gantt.change_view_mode(this.levels[this.level]);
				}
			}
		},
		applyClass: function applyClass(id) {
			for (dev in this.tasks) {
				this.tasks[dev].custom_class = id === this.tasks[dev].id ? 'is-active' : '';
			}
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended, this.directives);
		}
	});
});
define('project/components/menu', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#menu_tpl';
			this.data = {
				// TODO : pouvoir mettre les éléments du menu ici et plus dans le html
				active: '',
				menu: [{
					name: 'Développements',
					path: 'detailedProject',
					active: false
				}, {
					name: 'Ressources',
					path: 'resources',
					active: false
				}, {
					name: 'Infos pratiques',
					path: 'infos',
					active: false
				}, {
					name: 'Clients',
					path: 'customers',
					active: false
				}] // A recupérer autrement ?
			};
			this.methods = {
				toggleMenu: function toggleMenu() {
					document.getElementById('burger').classList.toggle('is-open');
				},
				changeActive: function changeActive() {}
			};
			this.mounted = function () {};
			this.createComponent();
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/affDetailedProject', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			// affProject ne prend que l'élément en argument
			this.compName = compName;
			this.template = '#detailed_project';
			// on initialise le data utilisé pour qu'il soit rendu dans la vue même s'il n'est pas encore rempli
			this.data = {
				detailedProject: {
					name: '',
					developments: [],
					developersMind: {}
				},
				notification: ''
			};
			this.methods = {
				openAddDev: function openAddDev() {
					topic.publish('openAddDev');
				},
				orderByAZ: function orderByAZ() {
					this.data.detailedProject.developments.sort(lang.hitch(this, this.$root.alpha));
				},
				orderByDate: function orderByDate() {
					// ne marche pas pour le moment
					this.data.detailedProject.developments.sort(lang.hitch(this, this.$root.date));
				}
			};
			this.createComponent();
			topic.subscribe('gotDetailedProject', lang.hitch(this, 'displayExpProj'));
			topic.subscribe('error', lang.hitch(this, 'alertError'));
		},
		displayExpProj: function displayExpProj(proj) {
			this.data.detailedProject = proj;
			setTimeout(topic.publish('loaded'), 200);
		},
		alertError: function alertError() {
			this.data.notification = 'Une erreur a eu lieu pendant le téléchargement.';
			setTimeout(lang.hitch(this, function () {
				this.data.notification = '';
			}), 3500);
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/development', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			topic.subscribe('refreshDevs', lang.hitch(this, 'refreshDevs'));
			topic.subscribe('gotDevelopment', lang.hitch(this, 'gotDev'));
			this.data = {
				editDevIsOpen: true
			};
			this.template = '#development';
			this.methods = {
				deleteDev: function deleteDev(dev, property) {
					console.log('Préparation à la suppression du développement ayant l\'id :', dev);
					topic.publish('deleteDev', dev, property);
				},
				openEditDev: function openEditDev(dev) {
					this.data.editDevIsOpen = true;
					topic.publish('openEditDev', dev);
				}
			};
			topic.subscribe('closeModal', lang.hitch(this, 'closeEditDev'));
			this.createComponent();
		},
		closeEditDev: function closeEditDev() {
			this.data.editDevIsOpen = false;
		},
		gotDev: function gotDev(dev) {
			this.data.developments = dev;
		},
		refreshDevs: function refreshDevs() {
			this.data.developments = [];
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/resources', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#resource-tpl';
			this.data = {
				resources: {}
			};
			this.methods = {
				openAddRes: function openAddRes() {
					topic.publish('openAddRes');
				},
				editRes: function editRes(id) {
					topic.publish('editRes');
				},
				getDetailedResource: function getDetailedResource(id) {
					topic.publish('getDetailedResource', id);
				}
			};
			this.createComponent();
			topic.subscribe('gotResources', lang.hitch(this, 'showResources'));
		},
		showResources: function showResources(resources) {
			this.data.resources = resources;
		},
		getHolidays: function getHolidays(e) {
			// for (var i = 0; i < this.data.resources.length; i++) {
			//   for (var i = 0; i < this.data.resources.length; i++) {
			//     topic.publish(e.target.id)
			//   }
			// }
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/detailedResource', ['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#detailed-resource-tpl';
			this.data = {
				isOpen: false,
				res: {
					id: '',
					name: '',
					firstName: '',
					baseEfficiency: 0,
					holidays: [],
					skillEfficiency: []
				}
			};
			this.methods = {
				drawBar: function drawBar(value) {
					var skill = 400 * value;
					return 'M 0 0 L ' + skill + ' 0 L ' + skill + ' 40 L 0 40';
				}
			};
			this.computed = {
				fullName: function fullName() {
					return this.data.res.firstName + ' ' + this.data.res.name;
				}
			};
			topic.subscribe('closeModal', lang.hitch(this, 'closeResource'));
			topic.subscribe('gotDetailedResource', lang.hitch(this, 'showResource'));
			this.createComponent();
		},
		closeResource: function closeResource() {
			this.data.isOpen = false;
		},
		showResource: function showResource(res) {
			this.data.isOpen = true;
			this.data.res = res;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/addResource', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#add-res-tpl';
			this.data = {
				isOpen: false,
				id: '',
				name: '',
				firstName: ''
			};
			this.computed = {
				id: function id() {
					return this.data.firstName.slice(0, 1) + this.data.name;
				}
			};
			this.methods = {
				close: function close() {
					console.log(this.id);
				},
				submitResource: function submitResource() {
					topic.publish('submitNewResource', this.id, this.name, this.firstName);
				}
			};
			topic.subscribe('openAddRes', lang.hitch(this, 'open'));
			topic.subscribe('closeModal', lang.hitch(this, 'close'));
			topic.subscribe('gotSkills', lang.hitch(this, 'populate'));
			this.createComponent();
		},
		open: function open() {
			topic.publish('getSkills');
			this.data.isOpen = true;
		},
		close: function close() {
			this.data.isOpen = false;
		},
		populate: function populate(skills) {
			this.data.allSkills = skills;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended);
		}
	});
});
define('project/components/addNewDev', ['dojo/_base/declare', 'dojo/_base/lang', 'dojo/topic', 'project/vueComponent'], function (declare, lang, topic, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			topic.subscribe('closeModal', lang.hitch(this, 'closeAddDev'));
			topic.subscribe('gotSkills', lang.hitch(this, this.populate));
			this.template = '#add-dev-tpl';
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
					"optional": false,
					"effort": 0,
					"skillTags": [],
					"project": ""
				},
				isOpen: false
			};
			this.methods = {
				submitNewDev: function submitNewDev(dev) {
					console.log(dev); // TODO: Trouver pourquoi le publish ne veut pas envoyer le dev
					topic.publish('saveDev', dev);
				}
			};
			topic.subscribe('openAddDev', lang.hitch(this, 'open'));
			this.createComponent();
		},
		closeAddDev: function closeAddDev() {
			this.data.isOpen = false;
		},
		open: function open() {
			this.data.isOpen = true;
			topic.publish('getSkills');
		},
		populate: function populate(skills) {
			this.data.allSkills = skills;
			this.data.isOpen = true;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});

define('project/components/editDev', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
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
				allSkills: ['SQL', 'JS', 'AJAX', 'DOJO', 'PHP'] // TODO: peupler via le store de ressources
			};
			this.methods = {
				saveDev: function saveDev(dev) {}
			};
			this.template = '#edit_the_dev';
			topic.subscribe('closeModal', lang.hitch(this, 'close'));
			topic.subscribe('closeEditModal', lang.hitch(this, 'close'));
			topic.subscribe('gotDetailedDevelopment', lang.hitch(this, 'populate'));
			this.createComponent();
		},
		close: function close(dev) {
			if (this.data.isOpen) {
				this.data.isOpen = false;
				topic.publish('stopEdit', dev);
			}
		},
		populate: function populate(dev) {
			this.data.dev = dev;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});
define('project/components/eventLoad', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.data = {
				isLoading: true
			};
			this.template = '#load_tpl';
			topic.subscribe('ganttRendered', lang.hitch(this, 'loaded'));
			topic.subscribe('error', function () {
				console.log('err');
			});
			this.createComponent();
		},
		loaded: function loaded() {
			console.log('ganttRendered');
			this.data.isLoading = false;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.extended);
		}
	});
});

define('project/components/modal', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#modal-tpl';
			this.data = {
				formData: {}
			};
			this.methods = {
				closeModal: function closeModal() {
					this.$root.modalOpen = false;
				}
			};
			this.createComponent();
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended);
		}
	});
});
define('project/components/addCustomer', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#add-customer-tpl';
			this.data = {
				test: 'excellent',
				formContent: {
					name: '',
					firstName: ''
				}
			};
			this.methods = {
				closeModal: function closeModal() {
					this.$root.modalOpen = false;
				},
				addCustomer: function addCustomer(id, data) {
					topic.publish('addCustomer', id, data);
					topic.publish('refreshCustomers');
				}
			};
			this.computed = {
				generateId: function generateId() {
					return this.data.formContent.firstName.slice(0, 1) + this.data.formContent.name;
				}
			};
			this.createComponent();
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended);
		}
	});
});
define('project/components/settings', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#_settings';
			this.data = {};
			this.methods = {};
			this.createComponent();
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended);
		}
	});
});
define('project/components/notification', ['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
	return declare(null, {
		constructor: function constructor(compName) {
			this.compName = compName;
			this.template = '#notification-tpl';
			this.data = {
				visible: false,
				type: '',
				title: '',
				message: ''
			};
			this.methods = {};
			topic.subscribe('notify', lang.hitch(this, 'showNotification'));
			this.createComponent();
		},
		showNotification: function showNotification(type, title, message) {
			this.data.tit = title;
			this.data.typ = type;
			this.data.message = message;
			this.data.visible = true;
		},
		createComponent: function createComponent() {
			this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended);
		}
	});
});
require(['project/project', 'project/cli_webSocket', 'dojo/_base/lang', 'dojo/topic', 'project/components/customers', 'project/components/affProjectList', 'project/components/calendar', 'project/components/tasks', 'project/components/menu', 'project/components/affDetailedProject', 'project/components/development', 'project/components/resources', 'project/components/detailedResource', 'project/components/addResource', 'project/components/addNewDev', 'project/components/editDev', 'project/components/eventLoad', 'project/components/modal', 'project/components/addCustomer', 'project/components/settings', 'project/components/notification', 'dojo/ready'], function (project, webSocket, lang, topic, customers, affProjectList, calendar, tasks, menu, affDetailedProject, development, resources, detailedResource, addResource, addNewDev, editDev, eventLoad, Modal, addCustomer, settings, notification, ready) {
	ready(function () {
		var call = new project(); // nouvel appel Json RPC
		var socket = new webSocket();
		var projList = new affProjectList('projects'); // nouveau component qui gère la liste des projets
		var _modal = new Modal('modal');
		var leMenu = new menu('leMenu');
		var _calendar = new calendar('calendar');
		var _tasks = new tasks('tasks');
		var loadWatcher = new eventLoad('loader'); // Surveille les évènements et donc le chargement des données demandées
		var detailedProject = new affDetailedProject('detailedProject');
		var _resources = new resources('resources');
		var detailedRes = new detailedResource('detailedRes');
		var _addResource = new addResource('addResource');
		var modalAdd = new addNewDev('addDev');
		var dev = new development('development');
		var modalEdit = new editDev('editDev');
		var _addClient = new addCustomer('addCustomer');
		var customersPanel = new customers('customers');
		var _settings = new settings('settings');
		var _notification = new notification('notification');
		new Vue({
			el: '#app',
			data: {
				currentView: '',
				lastView: '',
				isLoading: false,
				modalOpen: false,
				addDevIsOpen: false,
				addCustomerIsOpen: false,
				editDevIsOpen: false,
				formData: {}
			},
			methods: {
				close: function close() {
					topic.publish('closeModal');
					this.addDevIsOpen = false;
					this.editDevIsOpen = false;
					document.getElementById('burger').classList.remove('is-open');
				},
				closeModal: function closeModal() {
					this.modalOpen = false;
				},
				loading: function loading() {
					this.isLoading = true;
				},
				changeView: function changeView(lastView, url) {
					window.history.pushState(null, null, url);
					this.currentView = window.location.pathname.slice(1);
					this.lastView = lastView;
				},
				back: function back(lastView) {
					this.changeView(lastView, this.lastView);
				},
				loaded: function loaded() {
					this.isLoading = false;
				},
				alpha: function alpha(a, b) {
					if (a.name < b.name) return -1;
					if (a.name > b.name) return 1;
					return 0;
				},
				date: function date(a, b) {
					if (a.date < b.date) return -1;
					if (a.date > b.date) return 1;
					return 0;
				}
			},
			created: function created() {
				// Fonction appelée à la création de la vue
				topic.publish('getResources');
				this.currentView = window.location.pathname.slice(1);
			},
			updated: function updated() {
				topic.publish('useTemplate');
			}
		});
	});
});
define("public/js/project/dojorpc", function () {});

//# sourceMappingURL=bundle.js.map