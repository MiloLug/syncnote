<template>
    <button v-bind:type="type" class="button" v-bind:class="mainClasses">
        <slot></slot>
    </button>
</template>

<script>

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
    },
    data: function(){
        return {
            mainClasses: [
                'shadow-' + this.shadowPosition,
            ]
        };
    },
    methods: {
    }
}
</script>

<style scoped>
    .button {
        outline: none;
        border: none;
        background: var(--quartz-color-layer-3);
        height: 50px;
        border-radius: 50px;
        padding: 0px 20.5px;
        font-size: 16px;
        box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .button.shadow-none {
        box-shadow: none;
    }
    .button.shadow-right {
        box-shadow: 27px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .button.shadow-left {
        box-shadow: -27px 0px 14px 0px rgba(0,0,0,0.04);
    }

    .button:active {
        box-shadow: none;
        background: var(--quartz-color-layer-4);
    }
    .button:active.shadow-none {
        box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .button:active.shadow-right {
        box-shadow: 10px 0px 14px 0px rgba(0,0,0,0.04);
    }
    .button:active.shadow-left {
        box-shadow: -10px 0px 14px 0px rgba(0,0,0,0.04);
    }
</style>

