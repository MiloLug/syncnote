<template>
    <div
        class="note-editor"
        :class="{'show-icon-menu': showIconMenu}"
        :style="{'--note-color': color || 'var(--default-note-color)'}"
    >
        <div class="top-bar">
            <button class="menu-btn" @click="onMenuBtnClick">
                <ion-icon
                    class="icon"
                    :ios="icons[icon]"
                    :md="icons[icon]"
                    :key="icon"
                    type="button"
                ></ion-icon>
            </button>

            <quartz-input
                format="text"
                class="title"
                :placeholder="$lang.tr`Title|note editor field`"
                v-model="title"
                shadow="2-neu-soft-contrast"
                v-if="!showIconMenu"
            />
            <template v-if="showIconMenu">
                <quartz-input
                    format="text"
                    class="tag-input"
                    :placeholder="$lang.tr`Tag|tag input field`"
                    v-model="tag"
                    shadow="2-neu-soft-contrast"
                />
                <quartz-button
                    class="btn-add-tag"
                    @click="onBtnAddTagClick"
                >
                    {{ $lang.tr`Add tag` }}
                </quartz-button>
            </template>

            <div class="icon-menu" v-if="showIconMenu">
                <div class="menu-bg"></div>

                <div class="content screen1">
                    <div class="row-selector colors">
                        <button
                            class="item empty"
                            @click="onBtnColorClick(null)"
                        ></button>
                        <button
                            class="item"
                            v-for="itemColor in colors"
                            :key="itemColor"
                            :style="{'--note-color': itemColor}"
                            @click="onBtnColorClick(itemColor)"
                        ></button>
                    </div>

                    <div class="row-selector icons">
                        <button
                            class="item empty"
                            @click="onBtnIconClick(null)"
                        ></button>
                        <button
                            class="item"
                            v-for="iconName in iconsToUse"
                            :key="iconName"
                            @click="onBtnIconClick(iconName)"
                        >
                            <ion-icon
                                class="icon"
                                :ios="icons[iconName]"
                                :md="icons[iconName]"
                                type="button"
                            ></ion-icon>
                        </button>
                    </div>
                    <quartz-divider/>
                    <div class="tags">
                        <quartz-button
                            class="tag"
                            v-for="tagName in storeTags"
                            :key="tagName"
                            :class="{selected: tags.indexOf(tagName) !== -1}"
                            @click="onBtnTagClick(tagName)"
                        >
                            {{ tagName }}
                        </quartz-button>
                        <p class="no-tags" v-if="!storeTags.length">
                            {{ $lang.tr`No tags used` }}
                        </p>
                    </div>
                </div>
            </div>
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
import QuartzButton from './QuartzButton';
import QuartzDivider from "./QuartzDivider";
import { IonIcon } from '@ionic/vue';
import * as icons from 'ionicons/icons';


export default {
    name: 'NoteEditor',

    components: {
        TextEditor,
        QuartzInput,
        IonIcon,
        QuartzButton,
        QuartzDivider
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
                return this.modelValue?.icon ?? null;
            },
            set(icon) {
                this.$emit('update:modelValue', this.composeNote({icon}));
            }
        },

        storeTags() {
            const used = [];
            const others = [];

            for(const tagName of this.$store.state.note.orderedTagNames)
                (this.tags.indexOf(tagName) === -1 ? others : used).push(tagName);

            // to add "virtual" tags that aren't presented in the store (creation time)
            for(const tag of this.tags)
                if(used.indexOf(tag) === -1) used.push(tag);

            return [...used, ...others];
        }
    },

    watch: {
    },

    data() {
        return {
            icons,
            showIconMenu: false,
            tag: "",
            colors: ["#e35858", "#589be3", "#e3a058", "#5f9ea0"],
            iconsToUse: ["airplane", "bulb", "alert", "globe", "today", "person"],
        };
    },

    methods: {
        composeNote(update={}) {
            return {
                ...(this.modelValue ?? {}),
                content: this.content,
                title: this.title,
                color: this.color,
                tags: this.tags,
                ...update
            }
        },

        onMenuBtnClick() {
            this.showIconMenu = !this.showIconMenu;
        },

        onBtnAddTagClick() {
            const tag = this.tag.trim().toLowerCase();

            if(tag && this.tags.indexOf(tag) === -1) {
                this.tags = [...this.tags, tag];
            }
            this.tag = "";
        },
        onBtnTagClick(tag) {
            if(this.tags.indexOf(tag) === -1)
                this.tags = [...this.tags, tag];
            else
                this.tags = this.tags.filter(tagName => tagName !== tag);
        },

        onBtnColorClick(itemColor) {
            this.color = itemColor;
        },
        onBtnIconClick(iconName) {
            this.icon = iconName;
        }
    },
}
</script>

<style lang="scss" scoped>
    @use "@/styles/utils/tools.scss";

    .note-editor {
        --top-bar-height: 70px;

        &.show-icon-menu {
            overflow: hidden;
        }

        .top-bar {
            display: flex;
            background-color: var(--quartz-color-15-contrast);
            height: var(--top-bar-height);
            align-items: center;
        }

        .row-selector {
            overflow: auto;
            max-width: 100%;
            position: relative;
            display: flex;
            margin: 2px 0px;

            &.icons .item {
                border: 1px solid var(--quartz-color-4-contrast);
            }

            .item {
                min-width: 34px;
                min-height: 34px;
                background-color: var(--note-color);
                border-radius: 50px;
                margin: 2px 5px;

                &.empty {
                    background: transparent;
                    border: 2px solid var(--quartz-color-4-contrast);
                }

                .icon {
                    font-size: 19px;
                }
            }            
        }

        .icon-menu {
            position: fixed;        
            z-index: 999999;

            .menu-bg {
                position: fixed;
                width: 100%;
                height: 100%;
                top: var(--top-bar-height);
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
                width: calc(100% - 20px);
                height: calc(100% - var(--top-bar-height) - 70px);
                top: calc(var(--top-bar-height) + 10px);
                left: 10px;
                border-radius: 5px;
                overflow: auto;
                padding: 5px;

                .tag {
                    height: 28px;
                    margin: 2px 2px;
                    background: var(--quartz-color-1);
                    color: rgba(var(--quartz-text-color-rgb), 0.5);

                    &.selected {
                        background: var(--quartz-color-15-contrast);
                        color: var(--quartz-color-1);
                    }
                }
            }
        }

        .btn-add-tag {
            border-radius: 50px 0px 0px 50px;
        }

        .text-editor {
            position: absolute;
            top: var(--top-bar-height);
            left: 0;
            height: 100%;
            width: 100%;
        }

        
        .menu-btn {
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            color: var(--quartz-color-1);
            min-width: 50px;
            height: 50px;
            background-color: var(--note-color);
            border-radius: 0px 50px 50px 0px;
            font-size: 32px;
            
            .icon {
                --ionicon-stroke-width: 20;
            }
        }

        .title, .tag-input {
            width: 100%;
            margin: auto 10px;

            ::v-deep(.input){
                @include tools.placeholder {
                    color: rgba(var(--quartz-color-1-rgb), 0.6);
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
    }
</style>
