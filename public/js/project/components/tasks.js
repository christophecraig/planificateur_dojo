define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_task'
            this.data = {
                devs: {}
            }
            this.level = 3
            this.levels = [
                'Month',
                'Week',
                'Day',
                'Half Day',
                'Quarter Day'
            ]
            topic.subscribe('highlightRelated', lang.hitch(this, 'applyClass')) // doesn't exist yet, goal is to highlight the project in the calendar when we hover it in the developments view
            topic.subscribe('ganttLoaded', lang.hitch(this, 'storeDevs'))
            this.createComponent()
        },
        storeDevs(devs) {
            console.log('ganttLoaded')
            moment.locale('fr')
            this.__gantt = new Gantt('#gantt', devs, {
                on_date_change(task, start, end) {
                    console.log(task, start, end)
                },
                on_progress_change(task, progress) {
                    console.log(task, progress)
                },
                on_view_change(mode) {
                    console.log(mode)
                    topic.publish('ganttRendered')
                }
            })
            document.getElementById('zoom-in').addEventListener('click', lang.hitch(this, 'setZoomLevel', 1))
            document.getElementById('zoom-out').addEventListener('click', lang.hitch(this, 'setZoomLevel', 0))
            this.expanded = false
            document.getElementById('expand').addEventListener('click', lang.hitch(this, 'expandGantt'))
        },
        expandGantt() {
            if (!this.expanded) {
                document.getElementById('calendar').style = 'height:' + (window.innerHeight - 78) + 'px'
                document.getElementById('expand').classList.add('fa-compress')
                this.expanded = true
            } else {
                document.getElementById('calendar').style = 'height: 540px'
                document.getElementById('expand').classList.remove('fa-compress')
                this.expanded = false
            }
        },
        setZoomLevel(arg) {
            if (arg === 1) {
                if (this.level < 4) {
                    this.level++
                        return this.__gantt.change_view_mode(this.levels[this.level])
                }
            }
            if (arg === 0) {
                if (this.level > 0) {
                    this.level--
                        return this.__gantt.change_view_mode(this.levels[this.level])
                }
            }
        },
        applyClass(id) {
            for (dev in this.tasks) {
                this.tasks[dev].custom_class = (id === this.tasks[dev].id ? 'is-active' : '')
            }
        },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended, this.directives)
        }
    })
})