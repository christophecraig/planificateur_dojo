define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang', 'project/vueComponent'], function (declare, topic, lang, vueComponent) {
  return declare(null, {
    constructor: function (compName) {
      this.compName = compName
      this.template = '#calendar_tpl'
      this.data = {
        test: 'message de qualité'
      }
      this.extends = VueChartJs.Line
      this.mounted = function () {
        console.log('mounted')
        this.renderChart({
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
          datasets: [{
            label: 'Data One',
            backgroundColor: '#FC2525',
            data: [40, 39, 10, 40, 39, 80, 40]
          }, {
            label: 'Data Two',
            backgroundColor: '#05CBE1',
            data: [60, 55, 32, 10, 2, 12, 53]
          }]
        }, {
          responsive: true,
          maintainAspectRatio: false
        })
      }
      this.createComponent()
    },
    createComponent() {
      this.vue = new vueComponent(this.compName, this.template, this.data, this.methods, this.watch, this.mounted, this.extends)
    }
  })
})
