<template>
    <button class="card" :style="cssVars" :class="mainClasses">
        <div class="info">{{ new Date(noteData.updatedAt).toLocaleDateString() }}</div>
        <div class="title">
            <quartz-icon-block :icon="icon">{{ noteData.title }}</quartz-icon-block>
        </div>
        <hr class="divider"/>
        <div class="preview">
            asdassadsd<br>
            asd sad sad sadsad<br>
            asdasdsadjdjjjj d
        </div>
    </button>
</template>

<script>
import QuartzIconBlock from '../components/QuartzIconBlock';
import * as icons from 'ionicons/icons';
import styleProps, {applyClasses} from '../mixins/style-props.js';

export default {
    name:"NoteCard",
    components: {
        QuartzIconBlock
    },
    props: {
        ...styleProps,
        noteData: {
            required: true
        },
        shadow: {
            default: ()=>"2-neu",
        },
        quartzActive: {
            default: ()=>"true"
        }
    },
    data() {
        return {
            mainClasses: [
                {'has-color': !!this.noteData.color},
                ...applyClasses(this)
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

<style lang="scss" scoped>
    .card {
        --default-note-color: var(--quartz-color-25);
        
        display: inline-flex;
        flex-direction: column;
        padding: 20px;
        border-radius: 10px;
        font-size: 16px;
        align-items: stretch;
        outline: none;
        border: none;
        background-color: var(--quartz-color-25);
        
        &.has-color {
            background-image: linear-gradient(to left, var(--note-color) -310%, transparent 150%);
            border-right: 10px solid var(--note-color);
        }
        
        &:not(.has-color) {
            padding-right: 30px;
        }
    
        &:active {
            background-color: var(--quartz-color-4);
        }
        &:active.has-color {
            background-image: linear-gradient(to left, var(--note-color) -320%, transparent 150%);
            border-right: 10px solid var(--note-color);
        }
    
        .title {
            margin-bottom: 10px;
        }
    
        .preview {
            text-align: left;
            margin-bottom: 10px;
            line-height: 22px;
        }
        
        .divider {
            width: 100%;
            background: linear-gradient(to right, var(--quartz-color-1-contrast) -30%, transparent 100%);
            padding: 0;
            margin-left: 0;
            margin-bottom: 13px;
            height: 2px;
        }

        .info {
            font-size: 11px;
            text-align: right;
        }
    }
</style>

