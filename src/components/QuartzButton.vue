<template>
    <button
        :type="type"
        class="button"
        :class="mainClasses"
        :style="cssVars"
    >
        <slot></slot>
    </button>
</template>

<script>
import styleProps, {applyClasses, applyCss} from '../mixins/style-props.js';

export default {
    name:"QuartzButton",
    components: {
    },
    props: {
        shadowPosition: {
            default: ()=>"none",
            required: false
        },
        type: {
            default: ()=>"button",
            required: false
        },
        ...styleProps,
        quartzActive: {
            default: ()=>"true"
        },
        contrast: {
            default: ()=>"true"
        }
    },
    data: function(){
        return {
            mainClasses: [
                'contrast-' + this.contrast,
                ...applyClasses(this)
            ],
            cssVars: [
                ...applyCss(this)
            ]
        };
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
    .button {
        outline: none;
        border: none;
        background: var(--quartz-color-3);
        height: 50px;
        border-radius: 50px;
        padding: 0px 20.5px;
        font-size: 16px;

        &:active {
            background: var(--quartz-color-4);
        }

        &.contrast-true {
            background: var(--quartz-color-1-contrast);            
            color: var(--quartz-color-4);

            &:active {
                background: var(--quartz-color-4-contrast);
            }
        }
    }
</style>

