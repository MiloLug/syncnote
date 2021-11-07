<template>
    <div class="note" :style="cssVars" :class="mainClasses"> 
        <h1 class="title quartz-shadow-2-neu">
            <quartz-icon-block :icon="icon">{{ noteData.title }}</quartz-icon-block>
        </h1>
        <div class="ProseMirror" v-html="noteData.content"></div>
    </div>
</template>

<script>
import QuartzIconBlock from '../components/QuartzIconBlock';
import * as icons from 'ionicons/icons';

export default {
    name:"NoteView",
    components: {
        QuartzIconBlock
    },
    props: {
        noteData: {
            required: true
        },
    },
    data() {
        return {
            mainClasses: [
                {'has-color': !!this.noteData.color},
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
    .note {
        --default-note-color: var(--quartz-color-25);

        .ProseMirror {
            margin: 30px 10px;
            word-break: break-word;
            word-wrap: break-word;
            user-select: text;

            ::v-deep(p):empty::after {
                content: "\00A0";
            }
        }
        
        &.has-color {
            .title {
                background-image: linear-gradient(to left, var(--note-color) -310%, transparent 150%);
            }
        }

        .title {
            width: calc(100% - 18px);
            margin: 10px auto;
            padding: 11px 14px;
            border-radius: 40px;
            font-size: 23px;
            word-break: break-word;
            word-wrap: break-word;
            user-select: text;
        }
    }
</style>

