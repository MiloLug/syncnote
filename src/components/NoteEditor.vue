<template>
    <ion-page>
        <ion-content class="content">
            <text-editor
                class="editor"
                v-model="content"
                v-if="note"
            />
	</ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';
import TextEditor from './TextEditor.vue';


export default {
    name: 'Note',

    components: {
        IonPage,
        TextEditor
    },

    props: {
        modelValue: {
            default: ()=>({}),
            type: Object
        }
    },

    computed: {
    },

    data() {
        return {
            content: this.modelValue?.content ?? '',
            title: this.modelValue?.title ?? '',
            color: null
        };
    },

    methods: {
    }
}
</script>

<style lang="scss" scoped>
    .editor {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
    }
</style>
