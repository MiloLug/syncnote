<template>
    <button class="card" :style="cssVars" :class="mainClasses">
        <div class="card__info">21-09-2021</div>
        <div class="card__title">
            <quartz-icon-block :icon="icon">{{ noteData.title }}</quartz-icon-block>
        </div>
        <hr class="card__divider"/>
        <div class="card__text-fragment">
            asdassadsd<br>
            asd sad sad sadsad<br>
            asdasdsadjdjjjj d
        </div>
    </button>
</template>

<script>
import QuartzIconBlock from '../components/QuartzIconBlock';
import * as icons from 'ionicons/icons';

console.log(icons);

export default {
    name:"NoteCard",
    components: {
        QuartzIconBlock
    },
    props: {
        noteData: {
            required: true
        }
    },
    data: function(){
        return {
            mainClasses: [
                {'has-color': this.noteData.color},
            ],
            cssVars: {
                '--note-color': this.noteData.color || 'var(--default-note-color)'
            },
            icon: icons[this.noteData.iconName]
        };
    },
    methods: {
    }
}
</script>

<style scoped>
    .card {
        --default-note-color: var(--quartz-color-layer-3);
        
        display: inline-flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 10px;
        font-size: 16px;
        align-items: stretch;
        outline: none;
        border: none;
        background-color: var(--quartz-color-layer-3);
        box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .card.has-color {
        background-image: linear-gradient(to left, var(--note-color) -100%, transparent 150%);
        border-right: 10px solid var(--note-color);
    }
    .card:not(.has-color) {
        padding-right: 30px;
    }
    .card.shadow-none {
        box-shadow: none;
    }
    .card.shadow-right {
        box-shadow: 27px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .card.shadow-left {
        box-shadow: -27px 0px 14px 0px rgba(0,0,0,0.04);
    }

    .card:active {
        box-shadow: none;
        background-color: var(--quartz-color-layer-4);
    }
    .card:active.has-color {
        background-image: linear-gradient(to left, var(--note-color) -120%, transparent 150%);
        border-right: 10px solid var(--note-color);
    }
    .card:active.shadow-none {
        box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .card:active.shadow-right {
        box-shadow: 10px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .card:active.shadow-left {
        box-shadow: -10px 0px 14px 0px rgba(0,0,0,0.04);
    }

    
    .card__title {
        margin-bottom: 10px;
    }
    .card__text-fragment {
        text-align: left;
        margin-bottom: 10px;
        line-height: 22px;
    }
    .card__divider {
        width: 100%;
        background: linear-gradient(to right, var(--quartz-color-contrast-1) -30%, transparent 100%);
        padding: 0;
        margin-left: 0;
        margin-bottom: 13px;
        height: 2px;
    }
    .card__info {
        font-size: 11px;
        text-align: right;
    }
</style>

