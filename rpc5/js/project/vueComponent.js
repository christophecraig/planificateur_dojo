define(['dojo/_base/declare'], function(declare) {
    return declare(null, {
        constructor (compName, template, data, methods, watch, mounted, computed, props, created, extended) {
            return Vue.component(compName, {
                template: template,
                data () {
                    return {
                        data: data
                    }
                },
                methods: methods,
                watch: watch,
                mounted: mounted,
                computed: computed,
                props: props,
                created: created,
                extends: extended
            });
        }
    });
});
