<template>
    <ion-page>
        <ion-content class="content">
            <div class="search-bar">
                <quartz-input
                    format="text"
                    class="search"
                    v-model="searchString"
                    :placeholder="$lang.tr`Search|notes list field`"
                    shadow="2-neu-soft-contrast"
                />
                <quartz-button class="btn-order" @click="onBtnOrderClick">
                    <ion-icon
                        class="icon"
                        :ios="swapVertical"
                        :md="swapVertical"
                        type="button"
                    ></ion-icon>
                </quartz-button>
            </div>

            <div class="notes-list-wrapper">
                <div class="notes-list" :key="$store.state.note.filteredNotes">
                    <note-card
                        v-quartz:long-tap="onLongTap"
                        class="note-card"
                        v-for="id in $store.state.note.filteredNotes"
                        @click="onCardClick(id)"
                        :key="$store.state.note.notes[id]"
                        :note-data="$store.state.note.notes[id]"
                    ></note-card>
                </div>
            </div>

            <ion-fab vertical="bottom" horizontal="end" slot="fixed">
                <ion-fab-button
                    color="dark"
                    class="btn-add"
                    @click="onBtnAddClick"
                >
                    <ion-icon :icon="add" class="icon"/>
                </ion-fab-button>
            </ion-fab>
        </ion-content>

        <div class="ordering-menu" v-if="showOrderingMenu">
            <div class="menu-bg" @click="onOrderingMenuBgClick"></div>

            <div class="content">
                <quartz-button
                    class="ordering-entry"
                    v-for="ordering in orderings"
                    @click="onOrderingEntryClick(ordering)"
                    :class="{selected: ordering.fn === $store.state.note.orderingFunction}"
                    :key="ordering"
                >
                    {{ $lang.tr(ordering.name) }}
                </quartz-button>
            </div>
        </div>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { add, swapVertical } from 'ionicons/icons';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import {
    sortUpdatedAtAsc,
    sortUpdatedAtDesc,
    sortTitleAsc,
    sortTitleDesc,
    createTitleFilter
} from '../store/note';

import NoteCard from '../components/NoteCard';

export default {
    name: 'Login',

    components: {
        IonPage,
        NoteCard,
        IonContent,
        IonFab,
        IonFabButton,
        IonIcon,
        QuartzInput,
        QuartzButton
    },

    watch: {
        searchString(value) {
            this.filters.search = value ? createTitleFilter(value) : null;
            this.updateFiltering();
        }
    },

    data() {
        return {
            add,
            swapVertical,

            showOrderingMenu: false,
            orderings: [
                {name: 'Updated at asc|ordering', fn: sortUpdatedAtAsc},
                {name: 'Updated at desc|ordering', fn: sortUpdatedAtDesc},
                {name: 'Title asc|ordering', fn: sortTitleAsc},
                {name: 'Title desc|ordering', fn: sortTitleDesc}
            ],

            filters: {
                search: null,
                tags: null
            },
            searchString: "",
            tagsSeelcted: {}
        };
    },

    methods: {
        onCardClick(id) {
            this.$router.push({name: "note", params: {id}});
        },
        onBtnAddClick() {
            this.$router.push({name: "note-create"});
        },

        onBtnOrderClick() {
            this.showOrderingMenu = true;
        },
        onOrderingMenuBgClick() {
            this.showOrderingMenu = false;
        },
        onOrderingEntryClick(ordering) {
            this.$store.commit('note/newOrdering', ordering.fn);
            this.showOrderingMenu = false;
        },

        updateFiltering() {
            this.$store.commit(
                'note/newFiltering',
                Object.values(this.filters).filter(v => !!v)
            );
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

<style lang="scss" scoped>
    .search-bar {
        background: var(--quartz-control-panel-color);
        display: flex;
        height: 70px;
        align-items: center;
        
        .search {
            margin: 10px;
            width: 100%;
        }

        .btn-order {
            min-width: 50px;
            height: 50px;
            padding: 0;
            border-radius: 50px 0px 0px 50px;

            .icon {
                color: var(--quartz-color-1);
                font-size: 20px;
            }
        }
    }

    .ordering-menu {
        position: fixed;        
        z-index: 999999;

        .menu-bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: #2324268a;
            z-index: 1;
        }

        .content {
            position: fixed;
            display: inline-flex;
            flex-direction: column;
            background: white;
            z-index: 2;
            width: 80%;
            min-height: 100px;
            top: 100px;
            left: 10%;
        }

        .ordering-entry{
            margin: 5px;

            &.selected {
                border: 4px solid blue;
            }
        }
    }


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

    .btn-add .icon {
        color: var(--quartz-color-1);
        font-size: 36px;
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
