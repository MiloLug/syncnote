<template>
    <ion-page>
        <ion-content class="note-edit-content">
            <note-editor
                class="editor"
                v-model="noteOrigin"
                v-if="noteOrigin"
                :key="noteOrigin?.id"
            />
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonContent } from '@ionic/vue';
import NoteEditor from '../components/NoteEditor.vue';


export default {
    name: 'Note',

    components: {
        IonPage,
        NoteEditor,
        IonContent
    },

    computed: {
        noteOrigin: {
            get() {
                // so, without passing an id, I can use it in create mode
                if (!this.$route.params.id) {
                    if (this.note?.id !== this.$route.params.createId)
                        return {
                            id: this.$route.params.createId
                        };
                    return this.note;
                }

                const origin = this.$store.state.note.notes[this.$route.params.id];

                // return only a copy
                if (origin) {
                    return {
                        ...origin,
                        tags: [...origin.tags]
                    }
                }

                return undefined;
            },
            set(value) {
                this.note = value;
            }
        }
    },

    watch: {
        note(value) {
            if (value.title)
                this.$store.dispatch('note/commitNote', value);
        },
    },

    data() {
        return {
            note: null
        };
    },

    methods: {
    },

    mounted(){
        document.querySelector('.note-edit-content')?.scrollToTop?.(1000);
    },

    beforeRouteUpdate(to, from, next) {
        this.note = null;
        next();
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
