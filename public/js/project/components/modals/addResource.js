define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#add-res-tpl'
            this.data = {
                isOpen: false,
                addIsOpen: false,
                id: '',
                name: '',
                firstName: ''
            }
            this.props = ['isOpen']
            this.computed = {
                id () {
                    return this.data.firstName.slice(0, 1) + this.data.name
                },
                _isOpen () {
                    return this.$props.isOpen
                }
            }
            this.methods = {
                close () {
                    console.log(this.id)
                },
                submitResource () {
                    topic.publish('submitNewResource', this.id, this.name, this.firstName)
                }
            }
            this.updated = function () {
                window.scrollTo({
                    left: 0,
                    top: 640,
                    behavior: 'smooth'
                  })
            }
            topic.subscribe('openAddRes', lang.hitch(this, 'open'))
            topic.subscribe('closeModal', lang.hitch(this, 'close'))
            topic.subscribe('gotSkills', lang.hitch(this, 'populate'))
            this.createComponent()
        },
        open () {
            topic.publish('getSkills')
            this.data.isOpen = true
        },
        close () {
            this.data.isOpen = false
        },
        populate (skills) {
            this.data.allSkills = skills
        },
        createComponent () {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})