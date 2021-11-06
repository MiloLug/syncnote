<template>
    <ion-page>
        <ion-content class="content">
            <text-editor
                class="editor"
                v-model="note.content"
                v-if="note"
            />
	</ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';
import TextEditor from '../components/TextEditor.vue';


export default {
    name: 'Note',

    components: {
        IonPage,
        TextEditor
    },

    computed: {
        note() {
            return this.$store.state.note.notes[
                this.$route.params.id
            ];
        },
    },

    data() {
        return {
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
