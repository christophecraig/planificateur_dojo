require(['project/project', 'dojo/_base/lang', 'dojo/topic', 'project/calendar', 'project/customers', 'project/affProjectList', 'project/menu', 'project/affDetailedProject', 'project/development', 'project/resource', 'project/detailedResource', 'project/addNewDev', 'project/editDev', 'project/eventLoad', 'dojo/ready'],
    function (project, lang, topic, calendar, customers, affProjectList, menu, affDetailedProject, development, resource, detailedResource, addNewDev, editDev, eventLoad, ready) {
      ready(function () {
          var call = new project() // nouvel appel Json RPC
          var projList = new affProjectList('projects') // nouveau component qui gère la liste des projets
          var leMenu = new menu('leMenu')
          var clients = new customers('customers')
          var loadWatcher = new eventLoad('loader') // Surveille les évènements et donc le chargement des données demandées
          var detailedProject = new affDetailedProject('detailedProject')
          var resources = new resource('resource')
          var detailedRes = new detailedResource('detailedRes')
          var modalAdd = new addNewDev('modalForm')
          var dev = new development('development')
          var modalEdit = new editDev('editDev')
          // const store         = new Vuex
          // var graph           = new calendar('line-chart')
          new Vue({
              el: '#app',
              store: new Vuex.Store({
                  state: {
                    count: 0,
                    project: '',
                    openEdit: {

                    },
                    developments: {

                    },
                    resources: {

                    },
                    clients: {

                    }
                  },
                  mutations: {
                    increment(state) {
                      state.count++
                    },
                    populate(state, dev) {
                      state.openEdit = dev
                    }
                  }
                  }),
                data: {
                  currentView: '',
                  isLoading: false
                },
                methods: {
                  increment() {
                    this.$store.commit('increment')
                  },
                  close() {
                    topic.publish('closeModal')
                  },
                  loading() {
                    this.isLoading = true
                  },
                  loaded() {
                    this.isLoading = false
                  }
                },
                created() {
                  // Fonction appelée à la création de la vue
                  topic.publish('getResources')
                  topic.publish('getCustomers')
                }
              }); document.getElementById('body').classList.remove('loading')
          });
      });