define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_task'
            this.data = {
                sampleDev: {
                    name: '',
                    x: 30,
                    y: 10,
                    w: 85,
                    h: 15
                },
                devs: {},
                width: 110,
                example: 'incroyable'
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
            this.directives = {
                fill(canvasEl, binding, _this) {
                    console.log(_this.context.data.devs.length)
                    // Get canvas context
                    var ctx = canvasEl.getContext("2d");

                    // Clear the canvas
                    for (var i = 0; i < _this.context.data.devs.length; i++) {
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
                            case  'trotroPro':
                                ctx.fillStyle = 'red'
                                break
                        }
                        ctx.fillRect(15, 20 + (40 * i), binding.value, 38)
                        ctx.font = '18px Rubik, sans-serif'
                        ctx.fillStyle = '#f2f2f2'
                        ctx.fillText(_this.context.data.devs[i].id.fromProject, 20, 55 + (40 * i))
                    }
                    // Récupérer les dates + 
                    console.log('ok')
                }
            }
            // topic.subscribe('drawProjects', lang.hitch(this, 'drawTasks')) 
            topic.subscribe('tasks', lang.hitch(this, 'storeDevs'))
            this.createComponent()
        },
        storeDevs(devs) {
            this.data.devs = devs
            console.log(this)
        },
        // drawTasks() {
        //     this.canvas = document.getElementById('canvas')
        // 	this.canvas.setAttribute('width', 1920)
        // 	this.ctx = canvas.getContext('2d')
        // 	for (var dev in this.data.devs) {
        // 		console.log(devs[dev])
        // 	}
        //     this.ctx.fillStyle = '#c03030'
        //     console.log(lang.hitch(this.vue, function() {console.log(this())}))
        // 	this.ctx.fillRect(0, 0, 0, 0)
        // },
        createComponent() {
            this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.computed, this.props, this.created, this.updated, this.extended, this.directives)
        }
    })
})