define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
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
                    document.getElementById('burger').classList.remove('is-open')
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