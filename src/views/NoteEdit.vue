<template>
    <ion-page>
        <ion-content class="content">
            <note-editor class="editor" v-model="content"/>
	</ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';
import NoteEditor from '../components/NoteEditor.vue';


export default {
    name: 'Note',

    components: {
        IonPage,
        NoteEditor
    },

    computed: {
    },    

    data() {
        window.lol = this;
        return {
            content: "gg"
        };
    },

    methods: {
    }
}
</script>

<style lang="scss" scoped>
    .editor {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
</style>
