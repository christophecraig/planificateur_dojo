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