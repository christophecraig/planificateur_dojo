require(['project/project', 'project/cli_webSocket', 'dojo/_base/lang', 'dojo/topic', 'project/components/clients', 'project/components/affProjectList', 'project/components/menu', 'project/components/affDetailedProject', 'project/components/development', 'project/components/resource', 'project/components/detailedResource', 'project/components/addNewDev', 'project/components/editDev', 'project/components/eventLoad', 'project/components/modal', 'dojo/ready'],
  function (project, webSocket, lang, topic, clients, affProjectList, menu, affDetailedProject, development, resource, detailedResource, addNewDev, editDev, eventLoad, modal, ready) {
    ready(function () {
      var call = new project() // nouvel appel Json RPC
      var ws = new webSocket()
      var projList = new affProjectList('projects') // nouveau component qui gère la liste des projets
      var leMenu = new menu('leMenu')
      var loadWatcher = new eventLoad('loader') // Surveille les évènements et donc le chargement des données demandées
      var detailedProject = new affDetailedProject('detailedProject')
      var resources = new resource('resource')
      var detailedRes = new detailedResource('detailedRes')
      var modalAdd = new addNewDev('modalForm')
      var openModal = new modal('modal')
      var dev = new development('development')
      var modalEdit = new editDev('editDev')
      var clientsPanel = new clients('customer')
      new Vue({
        el: '#app',
        // components: [
        //   'projects',
        //   'leMenu',
        //   'loader',
        //   'detailedProject',
        //   'resource',
        //   'detailedRes',
        //   'modalForm',
        //   'modal',
        //   'development',
        //   'editDev',
        //   'customer',
        //   'test'
        // ],
        data: {
          currentView: '',
          lastView: '',
          isLoading: false,
          modalOpen: false,
          formData: {}
        },
        methods: {
          close() {
            topic.publish('closeModal')
            topic.publish('closeEditModal')
          },
          openModal(form) {
            this.formData = form
            this.modalOpen = true;
          },
          loading() {
            this.isLoading = true
          },
          changeView(lastView, url) {
            window.history.pushState(null, null, url);
            this.lastView = lastView
            this.currentView = window.location.pathname.slice(1)
          },
          back(lastView) {
            this.currentView = this.lastView
            this.lastView = lastView
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