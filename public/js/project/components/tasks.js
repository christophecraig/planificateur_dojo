define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_task'
            this.data = {
                devs: {}
            }
            this.methods = {
                    draw() {
                        if (!document.getElementById('shape0')) {
                            var svg = Snap(document.getElementById('svg'))

                            // this.drawing = svg.circle(100, 100, 100)
                            // this.drawing.attr({
                            //     fill: 'blue',
                            //     stroke: '#000'
                            // })
                            for (var i = 0; i < this.data.devs.length; i++) {
                                this['dev' + i] = Snap(document.getElementById(['dev' + i]))
                                this['shape' + i] = this['dev' + i].rect(20, 20 + 40 * i, 160, 35)
                                this['shape' + i].attr({
                                    id: ['shape' + i],
                                })
                                document.getElementById(['shape' + i]).addEventListener('click', lang.hitch(this, 'whoami'))
                            }
                        }

                    }
                },
                // topic.subscribe('drawProjects', lang.hitch(this, 'drawTasks')) 
                this.level = 3
            this.levels = [
                'Month',
                'Week',
                'Day',
                'Half Day',
                'Quarter Day'
            ]
            topic.subscribe('highlightRelated', lang.hitch(this, 'applyClass')) // doesn't exist yet
            topic.subscribe('tasks', lang.hitch(this, 'storeDevs'))
            this.createComponent()
        },
        storeDevs(devs, tasks) {
            console.log(devs, tasks)
            this.data.devs = devs
            this.tasks = tasks
            this.__gantt = new Gantt('#gantt', this.tasks, {
                on_date_change (task, start, end) {
                    console.log(task, start, end)
                },
                on_progress_change (task, progress) {
                    console.log(task, progress)
                },
                on_view_change (mode) {
                    console.log(mode)
                    topic.publish('ganttLoaded')
                }
            })
            window.addEventListener('click', lang.hitch( this, function() {
                this.__gantt.refresh(this.tasks)
            }))
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