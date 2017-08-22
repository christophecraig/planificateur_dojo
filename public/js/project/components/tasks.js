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
                },
                whoami(e) {
                    console.log('I am : ', e.target.id)
                },
                move() {

                }
            }
            this.directives = {
                fill(canvasEl, binding, _this) {
                    console.log(_this.context.data.devs.length)
                    // Get canvas context
                    var ctx = canvasEl.getContext("2d");

                    // Clear the canvas
                    // for (var i = 0; i < _this.context.data.devs.length; i++) {
                    // ctx.clearRect(15, 20, 300, 12)
                    switch (_this.context.data.devs[i].id.fromProject) {
                        case 'IIMPro':
                            ctx.fillStyle = '#e03030'
                            break
                        case 'ReimsPro':
                            ctx.fillStyle = 'green'
                            break
                        case 'CairnPro':
                            ctx.fillStyle = 'blue'
                            break
                        case 'RAMEAUPro':
                            ctx.fillStyle = 'orange'
                            break
                        case 'NumilogPro':
                            ctx.fillStyle = 'purple'
                            break
                        case 'ModuleFRBRGestionPro':
                            ctx.fillStyle = 'darkgrey'
                            break
                        case 'OptiPMBPro':
                            ctx.fillStyle = 'darkblue'
                            break
                        case 'PHP7Pro':
                            ctx.fillStyle = 'yellow'
                            break
                        case 'PMBKnowledgePro':
                            ctx.fillStyle = '#e03030'
                            break
                        case 'CataAutoPro':
                            ctx.fillStyle = '#e03030'
                            break
                        case 'RadioFrancePro':
                            ctx.fillStyle = 'salmon'
                            break
                        case 'ModuleFRBRGestionPro':
                            ctx.fillStyle = '#7f434f'
                            break
                        case 'RFDiversPro':
                            ctx.fillStyle = '#47f2aa'
                            break
                        case 'ArteVODPro':
                            ctx.fillStyle = '#47f2aa'
                            break
                        case 'Project_ID.1':
                            ctx.fillStyle = '#47f2aa'
                            break
                        case 'trotroPro':
                            ctx.fillStyle = 'red'
                            break
                    }
                    ctx.fillRect(15, 20 + (40 * i), binding.value, 38)
                    ctx.font = '18px Rubik, sans-serif'
                    ctx.fillStyle = '#f2f2f2'
                    ctx.fillText(_this.context.data.devs[i].id.fromProject, 20, 45 + (40 * i))
                    // }
                    for (var i = 0; i < _this.context.data.devs.length; i++) {
                        Snap('#calendar')
                    }
                    // Récupérer les dates + 
                    console.log('ok')
                }
            }
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
                    on_date_change: function(task, start, end) {
                        console.log(task, start, end)
                    },
                    on_progress_change: function(task, progress) {
                        console.log(task, progress)
                    },
                    on_view_change: function(mode) {
                        console.log(mode)
                    }
                })
            }), 2000) // Temporaire, à rappeler via un évènement émis par le store ou project.js

            document.getElementById('zoom-in').addEventListener('click', lang.hitch(this, 'setZoomLevel', 1))
            document.getElementById('zoom-out').addEventListener('click', lang.hitch(this, 'setZoomLevel', 0))
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