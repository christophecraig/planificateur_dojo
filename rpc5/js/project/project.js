define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'dojo/rpc/JsonService'], function (declare, topic, lang, JsonService) {
  return declare(null, {
    constructor() {
      this.project = new JsonService('http://192.168.0.80/~mbeacco/macro_planning/viewOnto/classes/dataset/ws-serv.php')
      this.sliderProjects = []
      this.color = ''
      this.getProjects()
      this.ids = []
      this.projectIsLoading = false
      topic.subscribe('addDev', lang.hitch(this, 'submitNewDev'))
      topic.subscribe('deleteDev', lang.hitch(this, 'deleteDev'))
      topic.subscribe('addRes', lang.hitch(this, 'submitNewRes'))
      topic.subscribe('addProj', lang.hitch(this, 'submitNewProj'))
      topic.subscribe('getResources', lang.hitch(this, 'getResources'))
      topic.subscribe('saveDev', lang.hitch(this, 'submitNewDev'))
      topic.subscribe('getSkills', lang.hitch(this, 'getSkills'))
      topic.subscribe('getDetailedResource', lang.hitch(this, 'getDetailedResource'))
      topic.subscribe('fetchDev', lang.hitch(this, 'fetchDev'))
      topic.subscribe('getCustomers', lang.hitch(this, 'getCustomers'))
    },
    getProjects() {
      topic.publish('loading') // ici on met en place un petit loader pour indiquer que l'attente est normale
      this.project.getListOfProjects().then(lang.hitch(this, 'gotProjects'), lang.hitch(this, 'reportError'))
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
        this.sliderProjects = document.getElementsByClassName('project')
        // tableau des divs .projet
        for (var i = 0; i < this.sliderProjects.length; i++) {
          this.sliderProjects[i].addEventListener('click', lang.hitch(this, 'getDetailedProject'))
          this.sliderProjects[i].nb = i // On ajoute la propriété
          this.sliderWidth += this.sliderProjects[i].clientWidth + 8 // Pour ajouter la marge
        }
        document.getElementById('scroll_container').style = 'width: ' + (this.sliderWidth) + 'px;'
      }), 400);
    },
    getDetailedProject(id) {
      topic.publish('loading')
      this.currentProject = id.target.nb
      if (!this.projectIsLoading) {
        this.projectIsLoading = true
        this.project.getDetailedProject(this.ids[this.currentProject]).then(lang.hitch(this, 'gotDetailedProject'), lang.hitch(this, 'reportError'))
      }
    },
    gotDetailedProject(proj) {
      topic.publish('gotDetailedProject', proj)
      topic.publish('refreshDevs')
      topic.publish('loaded')
      for (var i = 0; i < proj.developments.length; i++) {
        this.project.getDetailedDevelopment(proj.developments[i]).then(lang.hitch(this, 'gotDevelopment'), lang.hitch(this, 'reportError'))
      }
      this.projectIsLoading = false
    },
    fetchDev(devId) {
      this.project.getDetailedDevelopment(devId).then(lang.hitch(this, 'populateEditModal'), lang.hitch(this, 'reportError'))
    },
    populateEditModal(dev) {
      topic.publish('populateEditModal', dev)
    },
    gotDevelopment(dev) {
      topic.publish('gotDevelopment', dev)
    },
    deleteDev() {
      // this.project.deleteDevelopment().then(lang.hitch(this, ''), lang.hitch(this, 'reportError'))
    },
    submitNewDev() {
      // On aura besoin d'une vérification de la validité des données.
      this.project.addDevelopment().then(lang.hitch(this, 'isAdded'), lang.hitch(this, 'reportError'))
    },
    submitNewRes() {
      console.log('ajout dune ressource')
      // this.project.addResource({
      //   "id": 'ccraig',
      //   "name": 'Craig',
      //   "firstName": 'Christophe'
      // }).then(lang.hitch(this, function() {
      //   topic.publish('success', this)
      // }), lang.hitch(this, 'reportError'))
    },
    submitNewProj(project) {
      // Impeccable, ça fonctionne, à remplacer par des données récupérées sur le serveur (objet project)
      // this.project.addProject(project).then(lang.hitch(this, 'projAdded'), lang.hitch(this, 'reportError'))
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
      this.project.getResources().then(lang.hitch(this, 'gotResources'), lang.hitch(this, 'reportError'))
    },
    gotResources(resources) {
      topic.publish('gotResources', resources)
      topic.publish('loaded')
    },
    getDetailedResource(id) {
      console.log(id)
      this.project.getAResource(id).then(lang.hitch(this, 'gotDetailedResource'), lang.hitch(this, 'reportError'))
    },
    gotDetailedResource(res) {
      topic.publish('gotDetailedResource', res)
    },
    getCustomers() {
      this.project.getCustomers().then(lang.hitch(this, 'gotCustomers'), lang.hitch(this, 'reportError'))
    },
    gotCustomers(customers) {
      console.log(customers)
      topic.publish('gotCustomers', customers)
    },
    reportError(err) {
      console.log(err)
      topic.publish('error')
    }
  })
})