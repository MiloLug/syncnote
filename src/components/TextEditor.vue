<template>
    <div class="editor">
        <div v-if="editor" class="control-panel" @mousedown="preventDown">
            <button
                class="control undo"
                @click="editor.chain().focus().undo().run()"
            >
                <ion-icon
                    :ios="returnUpBackOutline"
                    :md="returnUpBackOutline"
                    class="icon
                "></ion-icon>
            </button>
            <button
                class="control redo"
                @click="editor.chain().focus().redo().run()"
            >
                <ion-icon
                    :ios="returnUpForwardOutline"
                    :md="returnUpForwardOutline"
                    class="icon
                "></ion-icon>
            </button>
            <button
                @click="editor.chain().focus().toggleBold().run()"
                class="control bold"
                :class="{ 'is-active': editor.isActive('bold') }"
            >
                B
            </button>
            <button
                @click="editor.chain().focus().toggleItalic().run()"
                class="control italic"
                :class="{ 'is-active': editor.isActive('italic') }"
            >
                I
            </button>
            <button
                @click="editor.chain().focus().toggleStrike().run()"
                class="control strike"
                :class="{ 'is-active': editor.isActive('strike') }"
            >
                &nbsp;S&nbsp;
            </button>
            <button
                @click="editor.chain().focus().toggleCodeBlock().run()"
                class="control code-block"
                :class="{ 'is-active': editor.isActive('codeBlock') }"
            >
                <ion-icon
                    :ios="codeOutline"
                    :md="codeOutline"
                    class="icon
                "></ion-icon>
            </button>
            <button
                @click="editor.chain().focus().setParagraph().run()"
                class="control paragraph"
                :class="{ 'is-active': editor.isActive('paragraph') }"
            >
                P
            </button>
            <button
                @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
                class="control h1"
                :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
            >
                h1
            </button>
            <button
                @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                class="control h2"
                :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
            >
                h2
            </button>
            <button
                @click="editor.chain().focus().toggleBulletList().run()"
                class="control bullet-list"
                :class="{ 'is-active': editor.isActive('bulletList') }"
            >
                <ion-icon
                    :ios="listOutline"
                    :md="listOutline"
                    class="icon
                "></ion-icon>
            </button>
            <button
                @click="editor.chain().focus().toggleOrderedList().run()"
                class="control ordered-list"
                :class="{ 'is-active': editor.isActive('orderedList') }"
            >
                1 ....<br>
                2 ....<br>
                3 ....<br>
            </button>
            <button
                @click="editor.chain().focus().toggleBlockquote().run()"
                class="control blockquote"
                :class="{ 'is-active': editor.isActive('blockquote') }"
            >
                "
            </button> 
    </div>
    <div class="editor-content-wrapper">
        <editor-content
            class="editor-content"
            :editor="editor"
        />
    </div>
  </div>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Indent } from '../utils/tiptap-indent';
import { IonIcon } from '@ionic/vue';
import { listOutline, codeOutline, returnUpForwardOutline, returnUpBackOutline } from 'ionicons/icons';

export default {
    name: 'TextEditor',
    
    components: {
        EditorContent,
        IonIcon
    },

    props: {
        modelValue: {
            default: "",
            type: String
        }
    },

    watch: {
        modelValue(value) {
            if (this.editor.getHTML() === value)
                return;

            this.editor.commands.setContent(this.modelValue, false);
        },
    },

    data() {
        return {
            editor: null,
            listOutline,
            codeOutline,
            returnUpForwardOutline,
            returnUpBackOutline,
        }
    },

    mounted() {
        this.editor = new Editor({
            extensions: [
                Indent,
                StarterKit,
                Placeholder.configure({
                    placeholder: () => this.$lang.tr`Start writing`
                }),
            ],
            content: this.modelValue,
            onUpdate: () => {
                this.$emit('update:modelValue', this.editor.getHTML())
            },
        });
    },

    methods: {
        preventDown(e) {
            e.preventDefault();
        }
    },

    beforeUnmount() {
        this.editor.destroy();
    },
}
</script>

<style lang="scss" scoped>
.editor {
    display: inline-block;
    overflow: hidden;
}

.control-panel {
    display: flex;
    position: relative;
    z-index: 99;
    top: 0;
    left: 0;
    width: 100%;
    border-radius: 0px 0px 8px 8px;
    padding: 10px;
    background-color: var(--quartz-color-15-contrast);
    border: none;
    box-shadow: var(--quartz-shadow-center), var(--quartz-shadow-left);
    overflow-x: auto;
 
    .control {
        font-family: "JetBrainsMono", monospace;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 15px;
        margin: 3px;
        min-width: 40px;
        min-height: 40px;
        border-radius: 5px;
        background-color: var(--quartz-color-1-contrast);
        transition: background-color .2s ease-in, color .2s ease-in;
        border: 1px solid transparent;

        &, & * {
            color: var(--quartz-color-1);
        }

        &:hover, &.is-active {
            background-color: var(--quartz-color-4-contrast);
            box-shadow: var(--quartz-shadow-2-neu-soft-contrast);
        }
 
        &.redo {
            margin-right: 10px;
        }

        &.bold {
            font-weight: bold;
        }
        &.italic {
            font-style: italic;
        }
        &.strike {
            text-decoration: line-through;
        }
        &.ordered-list {
            font-size: 7px;
            font-weight: bold;
            line-height: 8px;
        }

        .icon {
            font-size: 22px;
        }
    }
}

.editor-content-wrapper {
    display: block;
    overflow: auto;
    max-height: calc(100% - 68px);
    position: absolute;
    padding-bottom: 20px;
    min-width: 100%;
}

.editor-content {
    position: relative;
    margin: 10px;
    margin-bottom: 30px;
}

::v-deep(.ProseMirror) {
    word-break: break-word;
    word-wrap: break-word;
}

</style>

