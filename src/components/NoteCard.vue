<template>
    <div class="card" :class="{'has-warning': $store.state.note.oversizedNotes[noteData.id]}">
        <button
            :style="cssVars"
            :class="[mainClasses]"
            class="content"
            @click="onCardClick"
        >
            <div class="info">{{ new Date(noteData?.updatedAt).toLocaleDateString($lang.tr`__lang_code__`) }}</div>
            <div class="title">
                <quartz-icon-block :icon="icon">{{ noteData?.title }}</quartz-icon-block>
            </div>
            <quartz-divider class="divider"/>
            <div class="warning" v-if="$store.state.note.oversizedNotes[noteData.id]">
                {{ $lang.tr`Cant be syncronized` }}
            </div>
        </button>

        <div class="controls">
            <quartz-button class="control" @click="onBtnDeleteClick">{{ $lang.tr`Delete` }}</quartz-button>
            <quartz-button class="control" @click="onBtnCloneClick">{{ $lang.tr`Clone` }}</quartz-button>
        </div>
    </div>
</template>

<script>
import QuartzIconBlock from './QuartzIconBlock';
import QuartzButton from './QuartzButton';
import QuartzDivider from './QuartzDivider';
import * as icons from 'ionicons/icons';
import styleProps, {applyClasses} from '../mixins/style-props.js';

export default {
    name:"NoteCard",
    components: {
        QuartzIconBlock,
        QuartzButton,
        QuartzDivider
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
                {'has-color': !!this.noteData?.color},
                ...applyClasses(this)
            ],
            cssVars: {
                '--note-color': this.noteData?.color || 'var(--default-note-color)'
            },
            icon: icons[this.noteData?.icon] ?? null
        };
    },
    methods: {
        onCardClick() {
            this.$router.push({name: "note", params: {id: this.noteData.id}});
        },
        onBtnDeleteClick() {
            this.$store.dispatch('note/deleteNote', this.noteData.id);
        },
        onBtnCloneClick() {
            this.$store.dispatch('note/cloneNote', this.noteData.id);
        }
    }
}
</script>

<style lang="scss" scoped>
    .card {
        display: inline-flex;
        font-size: 16px;
        position: relative;
        background: transparent;
        // min-height: 140px;

        .content {
            display: inline-flex;
            flex-direction: column;
            padding: 20px;
            border-radius: 10px;
            font-size: 16px;
            align-items: stretch;
            outline: none;
            border: none;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: var(--quartz-color-25);
            // position: absolute;
            z-index: 1;

            &:active {
                background-color: var(--quartz-color-4);
            }

            &.has-color {
                background-image: linear-gradient(to left, var(--note-color) -310%, transparent 150%);
                border-right: 10px solid var(--note-color);

                &:active {
                    background-image: linear-gradient(to left, var(--note-color) -320%, transparent 150%);
                    border-right: 10px solid var(--note-color);
                }
            }
        }

        .controls {
            text-align: left;
            margin-bottom: 10px;
            line-height: 22px;
            z-index: 2;
            bottom: 40px;
            left: 20px;
            position: absolute;

            .control {
                height: 30px;
                margin: 10px 10px 0px 0px;
            }
        }

        &:not(.has-warning) {
            .content .divider {
                margin-bottom: 53px;
            }

            .controls {
                bottom: 15px;
            }
        }
    
        .title {
            margin-bottom: 10px;
            text-align: left;
            word-break: break-word;
            word-wrap: break-word;
        }
    
        

        .info {
            font-size: 11px;
            text-align: right;
        }

        .warning {
            font-size: 13px;
            margin: 53px 0px 0px 0px;
        }
    }
</style>
