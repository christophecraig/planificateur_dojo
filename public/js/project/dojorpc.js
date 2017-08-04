require(['project/project', 'project/cli_webSocket', 'dojo/_base/lang', 'dojo/topic', 'project/components/customers', 'project/components/affProjectList', 'project/components/menu', 'project/components/affDetailedProject', 'project/components/development', 'project/components/resource', 'project/components/detailedResource', 'project/components/addNewDev', 'project/components/editDev', 'project/components/eventLoad', 'project/components/modal', 'project/components/customerModal', 'project/components/settings', 'dojo/ready'],
	function (project, webSocket, lang, topic, customers, affProjectList, menu, affDetailedProject, development, resource, detailedResource, addNewDev, editDev, eventLoad, modal, customerModal, settings, ready) {
		ready(function () {
			var call = new project() // nouvel appel Json RPC
			var ws = new webSocket()
			var projList = new affProjectList('projects') // nouveau component qui gère la liste des projets
			var leMenu = new menu('leMenu')
			var loadWatcher = new eventLoad('loader') // Surveille les évènements et donc le chargement des données demandées
			var detailedProject = new affDetailedProject('detailedProject')
			var resources = new resource('resource')
			var detailedRes = new detailedResource('detailedRes')
			var modalAdd = new addNewDev('addDev')
			var dev = new development('development')
			var modalEdit = new editDev('editDev')
			var addClient = new customerModal('addCustomer')
			var customersPanel = new customers('customer')
			var _settings = new settings('settings')
			new Vue({
				el: '#app',
				data: {
					currentView: '',
					lastView: '',
					isLoading: false,
					modalOpen: false,
					addDevIsOpen: false,
					addResIsOpen: false,
					formData: {}
				},
				methods: {
					close() {
						topic.publish('closeModal')
						this.addDevIsOpen = false
						this.addResourceIsOpen = false
						this.addCustomerIsOpen = false
						document.getElementById('burger').classList.remove('is-open')
					},
					closeModal() {
						this.modalOpen = false
					},
					openModal() {
						// this.formData = form
						// this.modalType = modalType
						this.modalOpen = true
					},
					loading() {
						this.isLoading = true
					},
					changeView(lastView, url) {
						window.history.pushState(null, null, url);
						this.currentView = window.location.pathname.slice(1)
						this.lastView = lastView
					},
					back(lastView) {
						this.changeView(lastView, this.lastView)
					},
					loaded() {
						this.isLoading = false
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
					this.currentView = window.location.pathname.slice(1)
				},
				updated() {
					topic.publish('useTemplate')
				}
			});
			document.getElementById('body').classList.remove('loading')
		});
	});