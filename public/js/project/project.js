define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'dojo/rpc/JsonService', 'project/stores/clientStore', 'project/stores/projectStore', 'project/stores/devStore', 'project/stores/resourceStore', 'dojo/when'],
  function (declare, topic, lang, JsonService, clientStore, projectStore, devStore, resourceStore, when) {
    return declare(null, {
      constructor() {
        // this.project might change depending on your configuration and on your server

        //home-conf : 
        //this.project = new JsonService('http://localhost:8888/macro_planning/viewOnto/classes/dataset/ws-serv.php')
        // work-conf : 
        this.project = new JsonService('http://localhost/~pmbconfig/macro_planning/viewOnto/classes/dataset/ws-serv.php')
        this.sliderProjects = []
        this.color = ''
        this.projectStore = new projectStore(this.project)
        this.devStore = new devStore(this.project)
        this.resourceStore = new resourceStore(this.project)
        this.clientStore = new clientStore(this.project)
        this.getProjects()
        this.ids = []
        this.projectIsLoading = false
        topic.subscribe('addDev', lang.hitch(this, 'submitNewDev'))
        topic.subscribe('deleteDev', lang.hitch(this, 'deleteDev'))
        topic.subscribe('addRes', lang.hitch(this, 'submitNewRes'))
        topic.subscribe('addProj', lang.hitch(this, 'submitNewProj'))
        topic.subscribe('getResources', lang.hitch(this, 'getResources'))
        topic.subscribe('getClients', lang.hitch(this, 'getClients'))
        topic.subscribe('openEdit', lang.hitch(this, 'getDetailedDevelopment'))
        topic.subscribe('getDetailedProject', lang.hitch(this, 'getDetailedProject'))
        topic.subscribe('saveDev', lang.hitch(this, 'submitNewDev'))
        topic.subscribe('getSkills', lang.hitch(this, 'getSkills'))
        topic.subscribe('getDetailedResource', lang.hitch(this, 'getDetailedResource'))
      },
      getProjects() {
        topic.publish('loading') // ici on met en place un petit loader pour indiquer que l'attente est normale
        when(this.projectStore.query({
            short: true
          }),
          lang.hitch(this, 'gotProjects'),
          lang.hitch(this, 'reportError'))
      },
      gotProjects(proj) {
        topic.publish('loaded') // cet évènement indique que le chargement est terminé
        topic.publish('gotProjects', proj)
        // On rassemble les ids des projets dans un tableau pour pouvoir les réutiliser pour le
        // getDetailedProject(idDuProjet)
        this.sliderWidth = 0
        for (var prop in proj) {
          this.ids.push(prop)
        }
        setTimeout(lang.hitch(this, function () { // setTimeout pour laisser le temps au tableau ids de se construire
          this.sliderProjects = document.querySelectorAll('.project')
          // tableau des divs .projet
          for (var i = 0; i < this.sliderProjects.length; i++) {
            this.sliderProjects[i].nb = i // On ajoute la propriété
            this.sliderWidth += this.sliderProjects[i].clientWidth + 8 // Pour ajouter la marge
          }
          document.getElementById('scroll_container').style = 'width: ' + (this.sliderWidth) + 'px;'
        }), 400);
      },
      getDetailedProject(id) {
        topic.publish('loading')
        // this.project.getDetailedProject(this.ids[this.currentProject]).then(lang.hitch(this, 'gotDetailedProject'), lang.hitch(this, 'reportError'))
        when(this.projectStore.get(id), lang.hitch(this, 'gotDetailedProject'), lang.hitch(this, 'reportError'))

        // function (proj) {
        // console.log('le getDetailedProject marche aussi', proj)
        // })  
      },
      gotDetailedProject(proj) {
        topic.publish('gotDetailedProject', proj)
        topic.publish('refreshDevs')
        this.developmentsIds = []
        for (var i = 0; i < proj.developments.length; i++) {
          this.developmentsIds.push(proj.developments[i])
        }
        when(this.devStore.query(proj.developments), lang.hitch(this, 'gotDevelopment'), lang.hitch(this, 'reportError'))
        this.projectIsLoading = false
      },
      getDetailedDevelopment(devId) {
        when(this.devStore.get(devId), lang.hitch(this, 'gotDetailedDevelopment'), lang.hitch(this, 'reportError'))
      },
      gotDevelopment(dev) {
        topic.publish('gotDevelopment', dev)
      },
      gotDetailedDevelopment(dev) {
        topic.publish('gotDetailedDevelopment', dev)
      },
      deleteDev() {
        // this.project.deleteDevelopment().then(lang.hitch(this, ''), lang.hitch(this, 'reportError'))
      },
      submitNewDev(dev) {
        // On aura besoin d'une vérification de la validité des données.
        console.log(dev)
        when(this.devStore.add(dev), lang.hitch(this, 'isAdded'), lang.hitch(this, 'reportError'))
      },
      submitNewRes() {
        console.log('ajout dune ressource')
        this.project.addResource({
          "id": 'ccraig',
          "name": 'Craig',
          "firstName": 'Christophe'
        }).then(lang.hitch(this, function () {
          topic.publish('success', this)
        }), lang.hitch(this, 'reportError'))
      },
      submitNewProj(project) {
        // Impeccable, ça fonctionne, à remplacer par des données récupérées sur le serveur
        this.project.addProject(project).then(lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))

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
        this.getProjects()
      },
      getSkills() {
        this.project.getSkills().then(lang.hitch(this, 'gotSkills'), lang.hitch(this, 'reportError'))
      },
      gotSkills(skills) {
        topic.publish('gotSkills', skills)
      },
      isAdded() {
        console.log('Développement ajouté (normalement)')
      },
      getResources() {
        topic.publish('loading')
        when(this.resourceStore.query(), lang.hitch(this, 'gotResources'), lang.hitch(this, 'reportError'))
      },
      gotResources(resources) {
        topic.publish('gotResources', resources)
        topic.publish('loaded')
      },
      getDetailedResource(id) {
        when(this.resourceStore.get(id), lang.hitch(this, 'gotDetailedResource'), lang.hitch(this, 'reportError'))
      },
      gotDetailedResource(res) {
        topic.publish('gotDetailedResource', res)
      },
      getClients() {
        when(this.clientStore.query(), lang.hitch(this, 'gotClients'), lang.hitch(this, 'reportError'))
      },
      gotClients(clients) {
        topic.publish('gotClients', clients)
      },
      reportError(err) {
        console.log(err)
        topic.publish('error')
      }
    })
  })