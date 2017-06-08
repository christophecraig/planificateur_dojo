require(['project/project', 'project/cli_webSocket', 'dojo/_base/lang', 'dojo/topic', 'project/components/clients', 'project/components/affProjectList', 'project/components/menu', 'project/components/affDetailedProject', 'project/components/development', 'project/components/resource', 'project/components/detailedResource', 'project/components/addNewDev', 'project/components/editDev', 'project/components/eventLoad', 'dojo/ready'],
  function (project, webSocket, lang, topic, clients, affProjectList, menu, affDetailedProject, development, resource, detailedResource, addNewDev, editDev, eventLoad, ready) {
    ready(function () {
      var call = new project() // nouvel appel Json RPC
      var ws = new webSocket()
      var projList = new affProjectList('projects') // nouveau component qui gère la liste des projets
      var leMenu = new menu('leMenu')
      var loadWatcher = new eventLoad('loader') // Surveille les évènements et donc le chargement des données demandées
      var detailedProject = new affDetailedProject('detailedProject')
      var resources = new resource('resource')
      var detailedRes     = new detailedResource('detailedRes')
      var modalAdd = new addNewDev('modalForm')
      var dev = new development('development')
      var modalEdit = new editDev('editDev')
      var clientsPanel = new clients('customers')
      new Vue({
        el: '#app',
        data: {
          currentView: '',
          isLoading: false
        },
        methods: {
          close() {
            topic.publish('closeModal')
          },
          loading() {
            this.isLoading = true
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
        }
      });
      document.getElementById('body').classList.remove('loading')
    });
  });