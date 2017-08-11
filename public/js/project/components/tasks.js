define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_task'
            this.props = ['dev']
            this.data = {

            }
            this.methods = {

            }
            this.computed = {
                color() {
                    return '#C03030'
                },
                startDate() {
                    return this.$props.dev.plannedStartDate
                },
                currentY() {
                    return ''
                },
                height() {
                    return ''
                },
                length() {
                    return ''
                }
            }
            this.createComponent()
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended)
        }
    })
})