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
                <quartz-button class="menu-btn filter-tags" @click="onBtnFilterTagsClick">
                    <ion-icon
                        class="icon"
                        :ios="pricetagOutline"
                        :md="pricetagOutline"
                        type="button"
                    ></ion-icon>
                </quartz-button>
                <quartz-button class="menu-btn order" @click="onBtnOrderClick">
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
                        v-for="id in noteIds"
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

            <div class="menu ordering" v-if="showOrderingMenu">
                <div class="bg" @click="onMenuBgClick"></div>

                <div class="content">
                    <quartz-button
                        class="entry"
                        v-for="ordering in orderings"
                        @click="onOrderingEntryClick(ordering)"
                        :class="{selected: ordering.fn === $store.state.note.orderingFunction}"
                        :key="ordering"
                        shadow="center"
                    >
                        {{ $lang.tr(ordering.name) }}
                    </quartz-button>
                </div>
            </div>

            <div class="menu tag-filtering" v-if="showTagsMenu">
                <div class="bg" @click="onMenuBgClick"></div>

                <div class="content">
                    <quartz-button
                        class="tag"
                        v-for="tagName in tagList"
                        :key="tagName"
                        :class="{selected: tagsSelected[tagName]}"
                        @click="onBtnTagClick(tagName)"
                    >
                        {{ tagName }}
                    </quartz-button>
                    <p class="no-tags" v-if="!tagList.length">
                        {{ $lang.tr`No tags used` }}
                    </p>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonContent, IonFab, IonFabButton, IonIcon } from '@ionic/vue';
import { add, swapVertical, pricetagOutline } from 'ionicons/icons';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import {
    sortUpdatedAtAsc,
    sortUpdatedAtDesc,
    sortTitleAsc,
    sortTitleDesc,
    createTitleFilter,
    createTagsFilter
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

    computed: {
        noteIds() {
            return this.$store.state.note.filteredNotes.filter(
                id => this.$store.state.note.notes[id]
            );
        },
        storeTags() {
            return this.$store.state.note.orderedTagNames;
        },
        tagList() {
            const used = [];
            const others = [];

            for(const tagName of this.$store.state.note.orderedTagNames)
                (this.tagsSelected[tagName] ? used : others).push(tagName);

            return [...used, ...others];
        }
    },

    watch: {
        searchString(value) {
            this.filters.search = value ? createTitleFilter(value) : null;
            this.updateFiltering();
        },
        tagsSelected(value) {
            const tags = Object.getOwnPropertyNames(value);
            
            this.filters.tags = tags.length ? createTagsFilter(tags) : null;
            this.updateFiltering();
        },
        storeTags(value) {
            let update = false;
            for(const tag of Object.getOwnPropertyNames(this.tagsSelected)) {
                if((update = !this.$store.state.note.tags[tag]))
                    delete this.tagsSelected[tag];
            }
            if(update)
                this.tagsSelected = {...this.tagsSelected};
        }
    },

    data() {
        return {
            add,
            swapVertical,
            pricetagOutline,

            showOrderingMenu: false,
            showTagsMenu: false,
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
            tagsSelected: {}
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
        onMenuBgClick() {
            this.showOrderingMenu = false;
            this.showTagsMenu = false;
        },
        onOrderingEntryClick(ordering) {
            this.$store.commit('note/newOrdering', ordering.fn);
            this.showOrderingMenu = false;
        },

        onBtnFilterTagsClick() {
            this.showTagsMenu = !this.showTagsMenu;
        },
        onBtnTagClick(tagName) {
            if(this.tagsSelected[tagName])
                delete this.tagsSelected[tagName],
                this.tagsSelected = {...this.tagsSelected};
            else
                this.tagsSelected = {...this.tagsSelected, [tagName]: true};
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

        .menu-btn {
            min-width: 50px;
            height: 50px;
            padding: 0;
            
            &.order {
                border-radius: 50px 0px 0px 50px;
                margin-left: 8px;
            }

            .icon {
                color: var(--quartz-text-color-contrast);
                font-size: 20px;
            }
        }
    }

    .menu {
        position: fixed;        
        z-index: 999999;

        .bg {
            position: fixed;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: rgba(0, 0, 0, 0.699);
            z-index: 1;
            backdrop-filter: blur(2px);
        }

        .content {
            position: fixed;
            display: inline-flex;
            flex-direction: column;
            background: var(--quartz-color-25);
            z-index: 2;
            width: 80%;
            min-height: 100px;
            top: 100px;
            border-radius: 5px;
            left: 10%;
            padding: 10px;
        }

        &.ordering .entry{
            margin: 10px 5px;

            &.selected {
                background: var(--quartz-color-15);
                box-shadow: none;
            }
        }

        &.tag-filtering {
            .content {
                display: block;
                overflow: auto;
                max-height: calc(100% - 168px);

                .tag {
                    margin: 2px 2px;
                    background: var(--quartz-color-1);
                    color: rgba(var(--quartz-text-color-rgb), 0.5);
                    height: auto;
                    min-height: 28px;
                    display: inline-block;
                    word-break: break-word;
                    word-wrap: break-word;
                    padding: 6px 20.5px;

                    &.selected {
                        background: var(--quartz-color-15-contrast);
                        color: var(--quartz-color-1);
                    }
                }
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
