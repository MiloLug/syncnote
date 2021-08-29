<template>
    <ion-page>
        <ion-content class="content">
            <note-view
                :note-data="note"
                v-if="note"
            />
            <quartz-button
                type="button"
                class="edit-button"
                shadow="center"
                @click="onEditClick"
            >
                {{tr`Edit`}}
            </quartz-button>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';
import NoteView from '../components/NoteView.vue';
import QuartzButton from '../components/QuartzButton';
import { tr } from '../localization';

export default {
    name: 'Note',

    components: {
        IonPage,
        NoteView,
    },

    computed: {
        note() {
            return this.$store.state.notes.notesList[
                this.$route.params.id
            ];
        }
    },    

    data() {
        return {
            tr
        };
    },

    methods: {
        onEditClick() {
            this.$router.push({
                name: "note-edit",
                params: {id: this.$route.params.id}
            });
        }
    }
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
