define(['dojo/_base/declare', 'dojo/topic', 'dojo/_base/lang'], function (declare, topic, lang) {
    return declare(null, {
        constructor() {
            topic.subscribe('openModal', lang.hitch(this, 'openModal'))
            topic.subscribe('closeModal', lang.hitch(this, 'closeModal'))
        },
        closeModal() {

        },
        openModal(mode, arg) {
            $.sweetModal({
                content: '<form name="editDev"><label>Titre<input type="text" v-model="data.dev.name" placeholder="Titre"></label><label>Au plus tôt<input type="date" v-model="data.dev.earlyStart"><input type="date" v-model="data.dev.earlyEnd"></label><label>Au plus tard<input type="date" v-model="data.dev.lateStart"><input type="date" v-model="data.dev.lateEnd"></label><label>Prévu<input type="date" v-model="data.dev.plannedStart"><input type="date" v-model="data.dev.plannedEnd"></label><label>Réel<input type="date"      v-model="data.dev.realStart" ><input type="date" v-model="data.dev.realEnd"></label><label>Priorité<select name="priority" v-model="data.dev.priority"><option value = "PrioTresHaute" > Très Haute < /option> <option value = "PrioHaute" > Haute < /option> <option value = "PrioNormale" > Normale < /option> <option value = "PrioBasse"> Basse </option> <option value="PrioTresBasse"> Très Basse </option></select></label><label>Facultatif<input type="radio" v-model="data.dev.optional" value="true"></label><label>Obligatoire<input type="radio" v-model="data.dev.optional" value="false"></label><label>développement nécessaire</label><label>développement parent</label><label>Ressources</label><label v-for="skill in data.allSkills">{{skill}}<input type = "checkbox" v-model="data.dev.skillTags" :value="skill"></label><div id="saveDev" class="btn" @click="submitNewDev(data.dev)">Ajouter</div></div></form>'
            })
        }
    })
})