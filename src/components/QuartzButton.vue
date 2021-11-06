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
    },
    data: function(){
        return {
            mainClasses: [
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
        background: var(--quartz-color-primary);
        color: var(--quartz-text-color-primary);
        height: 50px;
        border-radius: 50px;
        padding: 0px 20.5px;
        font-size: 16px;

        &:active {
            background: var(--quartz-color-primary-active);
        }
    }
</style>

