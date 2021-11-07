<template>
    <ion-page>
        <ion-content class="note-view-content">
            <note-view
                :note-data="note"
                v-if="note"
            />
            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button
                    color="dark"
                    class="btn-edit"
                    @click="onEditClick"
                >
                    <ion-icon :icon="pencil" class="icon"/>
                </ion-fab-button>
            </ion-fab>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { pencil } from 'ionicons/icons';
import NoteView from '../components/NoteView.vue';

export default {
    name: 'Note',

    components: {
        NoteView,
        IonPage,
        IonContent,
        IonFab,
        IonFabButton,
        IonIcon
    },

    computed: {
        note() {
            return this.$store.state.note.notes[
                this.$route.params.id
            ];
        }
    },    

    data() {
        return {
            pencil
        };
    },

    methods: {
        onEditClick() {
            this.$router.push({
                name: "note-edit",
                params: {id: this.$route.params.id}
            });
        }
    },

    mounted(){
        document.querySelector('.note-view-content')?.scrollToTop?.(1000);
    },
}
</script>

<style lang="scss" scoped>
    

    .notes-list-wrapper {
        text-align: center;
    }


    .notes-list {
        display: inline-flex;
        justify-content: start;
        flex-wrap: wrap;
        width: 384px;
    }


    .note-card {
        margin: 15px 20px;
        width: calc(100% - 40px);
        max-width: 344px;
    }
    .input-line.controls {
        text-align: right;
    }

    .btn-edit .icon {
        color: var(--quartz-color-1);
        font-size: 24px;
    }

    
    @media screen and (max-width: 383px) {
        .notes-list {
            width: 100%;
        }
    }

    @media screen and (min-width: 688px) and ( max-width: 767px) {
        .notes-list {
            width: 688px;
        }
        .note-card {
            max-width: 324px;
            width: calc(100% - 20px);
            margin: 15px 10px;
        }
    }
 
    @media screen and (min-width: 768px) {
        .notes-list {
            width: 768px;
        }
    }

    @media screen and (min-width: 1152px) {
        .notes-list {
            width: 1152px;
        }
    }
    
    @media screen and (min-width: 1300px) {
        .notes-list {
            width: 100%;
        }
    }
</style>
