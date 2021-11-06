<template>
    <ion-page>
        <ion-content class="content">
            <div class="notes-list-wrapper">
                <div class="notes-list">
                    <note-card
                        v-quartz:long-tap="onLongTap"
                        class="note-card"
                        v-for="(note, id) in $store.state.note.notes"
                        @click="onCardClick(id, note)"
                        :key="note"
                        :note-data="note"
                    ></note-card>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';

import NoteCard from '../components/NoteCard';

export default {
    name: 'Login',

    components: {
        IonPage,
        NoteCard
    },

    data() {
        return {
        };
    },

    methods: {
        onCardClick(id, note) {
            this.$router.push({name: "note", params: {id}});
        },
        onSubmit(e) {
            e.preventDefault();
            return false;
        },
        onLongTap() {
            console.log(321213);
        }
    }
}
</script>

<style scoped>
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
