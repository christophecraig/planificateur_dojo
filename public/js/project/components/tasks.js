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
        storeDevs(devs) {
            this.data.devs = devs
            this.tasks = []
            setTimeout(lang.hitch(this, function () {
                for (var dev in devs) {
                    this.tasks.push({}) // Pour ne pas se prendre un "undefined"
                    for (var prop in devs[dev]) {
                        if (devs[dev][prop] !== null) {
                            switch (prop) {
                                case 'earlyStart':
                                case 'plannedStart':
                                case 'realStart':
                                case 'lateStart':
                                    this.tasks[dev].start = devs[dev][prop]
                                    break
                                case 'earlyEnd':
                                case 'plannedEnd':
                                case 'realEnd':
                                case 'lateEnd':
                                    this.tasks[dev].end = devs[dev][prop]
                                    break
                                case 'id':
                                    this.tasks[dev].id = devs[dev][prop]
                                    break
                                case 'name':
                                    this.tasks[dev].name = devs[dev][prop]
                                    break
                                case 'effort':
                                    this.tasks[dev].progress = devs[dev][prop]
                                    break
                            }
                        }
                    }
                }
                this.__gantt = new Gantt('#gantt', this.tasks, {
                    on_date_change: function (task, start, end) {
                        console.log(task, start, end)
                    },
                    on_progress_change: function (task, progress) {
                        console.log(task, progress)
                    },
                    on_view_change: function (mode) {
                        console.log(mode)
                    }
                })
            }), 2000) // Temporaire, à rappeler via un évènement émis par le store ou project.js

            document.getElementById('zoom-in').addEventListener('click', lang.hitch(this, 'setZoomLevel', 1))
            document.getElementById('zoom-out').addEventListener('click', lang.hitch(this, 'setZoomLevel', 0))
            this.expanded = false
            document.getElementById('expand').addEventListener('click', lang.hitch(this, 'growGantt'))
        },
        growGantt() {
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