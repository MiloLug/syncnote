<template>
    <div class="note-editor">
        <div class="input-panel">
            <button class="icon-wrapper">
                <ion-icon
                    class="icon"
                    :ios="icons[icon]"
                    :md="icons[icon]"
                    type="button"
                ></ion-icon>
            </button>
            <quartz-input
                format="text"
                class="title"
                :placeholder="$lang.tr`Title|note editor field`"
                v-model="title"
                shadow="2-neu-soft-contrast"
            />
        </div>
        <text-editor
            class="text-editor"
            v-model="content"
        />
    </div>
</template>

<script lang="js">
import TextEditor from './TextEditor';
import QuartzInput from './QuartzInput';
import { IonIcon } from '@ionic/vue';
import * as icons from 'ionicons/icons';


export default {
    name: 'Note',

    components: {
        TextEditor,
        QuartzInput,
        IonIcon
    },

    props: {
        modelValue: {
            default: ()=>({}),
            type: Object
        }
    },

    computed: {
        content: {
            get() {
                return this.modelValue?.content ?? '';
            },
            set(content) {
                this.$emit('update:modelValue', this.composeNote({content}));
            }
        },
        title: {
            get() {
                return this.modelValue?.title ?? '';
            },
            set(title) {
                this.$emit('update:modelValue', this.composeNote({title}));
            }
        },
        tags: {
            get() {
                return this.modelValue?.tags ?? [];
            },
            set(tags) {
                this.$emit('update:modelValue', this.composeNote({tags}));
            }
        },
        color: {
            get() {
                return this.modelValue?.color ?? null;
            },
            set(color) {
                this.$emit('update:modelValue', this.composeNote({color}));
            }
        },
        icon: {
            get() {
                return this.modelValue?.icon ?? "banOutline";
            },
            set(icon) {
                this.$emit('update:modelValue', this.composeNote({icon}));
            }
        }
    },

    watch: {
    },

    data() {
        return {
            icons
        };
    },

    methods: {
        composeNote(update={}) {
            return {
                ...(this.modelValue ?? {}),
                content: this.content,
                titel: this.title,
                color: this.color,
                tags: this.tags,
                ...update
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    @use "@/styles/utils/tools.scss";

    .text-editor {
        position: absolute;
        top: 70px;
        left: 0;
        height: 100%;
        width: 100%;
    }

    .input-panel {
        display: flex;
        background-color: var(--quartz-color-15-contrast);
        height: 70px;
        align-items: center;
    }

    .icon-wrapper {
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--quartz-color-1);
        min-width: 50px;
        height: 50px;
        background: cadetblue;
        border-radius: 0px 50px 50px 0px;
        font-size: 32px;
        
        .icon {
            --ionicon-stroke-width: 20;
        }
    }

    .title {
        width: 100%;
        margin: auto 10px;

        ::v-deep(.input){
            @include tools.placeholder {
                color: var(--quartz-color-3);
            }

            box-shadow: var(--quartz-shadow-2-neu-soft-contrast), var(--quartz-inner-shadow-2-neu-concave-soft-contrast);
            border-color: transparent;
            color: var(--quartz-color-1);

            &:focus {
                background-color: var(--quartz-color-4-contrast);
                box-shadow: var(--quartz-shadow-2-neu-contrast);
                border-width: 1px;
            }
        }
    }
</style>

<style lang="scss">
    // .keyboard-on .note-editor {
    //     .text-editor:focus {
    //         top: 0;
    //         left: 0;
    //         height: calc(100% - 100px);
    //         width: 100%;
    //     }
    //     .title:not(:focus) {
    //         display: none;
    //     }
    // }
</style>
