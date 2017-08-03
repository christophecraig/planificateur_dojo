<template>
    <div id="app">
        <div id="sub-container">
            <!-- <loader></loader> -->
            <!--<line-chart></line-chart>-->
            <projects></projects>
            <!-- <le-menu></le-menu>
            <div id="bottom">
                <component :is="currentView" transition="fade" transition-mode="out-in"></component>
                <modal></modal>
            </div> -->
        </div>
    </div>
</template>

<script>
var dojoConfig = {
    async: true, 
    deps: ['../public/js/project/dojorpc'] 
}
import dojo from 'dojo/dojo'
import Projects from './components/Projects.vue'
import * as dojorpc from '../public/js/project/dojorpc' 
// import Loader from './components/Loader.vue'
// import LeMenu from './components/LeMenu.vue'
// import DetailedProject from './components/DetailedProject.vue'
// import Modal from './components/Modal.vue'

export default {
    name: 'app',
    components: {
        Projects 
        // Loader,
        // LeMenu,
        // Modal
    }
}
</script>
