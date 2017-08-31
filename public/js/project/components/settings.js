define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_settings'
            this.data = {
                settings: [
                    {
                        type: 'checkbox',
                        label: 'Afficher les indisponibilités sur le calendrier',
                        id: 'showHolidaysOnGantt',
                        value: false
                    },
                    {
                        type: 'color',
                        label: 'Couleur de la barre de navigation',
                        id: 'pickColor',
                        value: '#454545'
                    },
                    {
                        type: 'text',
                        label: 'Nom d\'utilisateur',
                        id: 'username',
                        value: ''
                    }
                ]
            }
            this.methods = {

            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})