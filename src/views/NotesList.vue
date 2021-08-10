<template>
    <ion-page>
        <ion-content class="content" forceOverscroll="false" overflow-scroll="false" no-bounce>
            <div class="notes-list-wrapper">
                <div class="notes-list">
                    <note-card
                        class="note-card"
                        v-for="(note, id) in $store.state.notes.notesList"
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
import { createGesture, IonPage } from '@ionic/vue';

import QuartzButton from '../components/QuartzButton';
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

    mounted() {
        /*let timeout;

        const clearGestureTimeout = () => {
            if (timeout) {
                clearTimeout(timeout);
                timeout = undefined;
            }
        };

        const gesture = createGesture({
            el: this.$el,
            threshold: 0,
            onStart: () => {
                clearGestureTimeout();					
                timeout = setTimeout(() => {
                    timeout = undefined;
                    console.log(23);
                }, 1000);
            },
            onMove: (detail) => {
                if (detail.deltaX <= 10 && detail.deltaY <= 10) {
                    return;
                }
                clearGestureTimeout();
            },
            onEnd: () => {
                clearGestureTimeout();
            },
        });

        gesture.enable(); */
    },

    methods: {
        onCardClick(id, note) {
            console.log(33);
        },
        onSubmit(e) {
            e.preventDefault();
            return false;
        },
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
