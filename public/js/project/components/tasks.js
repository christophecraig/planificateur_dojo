define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
    return declare(null, {
        constructor(compName) {
            this.compName = compName
            this.template = '#_task'
            this.props = ['dev']
            this.data = {
                sampleDev: {
                    name: '',
                    x:30, 
                    y:10, 
                    w:85, 
                    h:15
                },
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
                fill: function(canvasEl, binding) {
                    console.log(binding)
                        // Get canvas context
                        var ctx = canvasEl.getContext("2d");
                        // Clear the canvas
                        ctx.clearRect(15,20,300,10)
                        ctx.fillStyle = "#c04040"                      
                        ctx.fillRect(15, 20, binding.value, 10)
                    }
            }
            // topic.subscribe('drawProjects', lang.hitch(this, 'drawTasks'))            
            this.createComponent()
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