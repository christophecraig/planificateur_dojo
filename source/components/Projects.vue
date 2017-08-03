<template>
  <transition name="fade">
    <div id="projects-slider">
      <div id="data">
        <div id="scroll_container">
          <div class="project" v-for="project in projects" :proj-id="project.id" @click="openDev(project.id)">
            <!-- PROJECT COLOR ICI -->{{project.name}}</div>
          <div class="project" @click="addProj">Ajouter un projet</div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import topic from 'dojo/topic'
export default {
  name: 'Projects',
  data() {
    return {
      msg: 'wow',
      projects: {
        name: ''
      }
    }
  },
  created() {
    console.log(window.dojo)
    
  },
  methods: {
    openDev(id) {
      console.log('openDev')
    },
    addProj() {
      console.log('addProj')
    }
  }
}
</script>
