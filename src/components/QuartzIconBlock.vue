<template>
    <div
        class="icon-block"
        :class="mainClasses"
    >
        <ion-icon
            v-if="icon && iconPosition == 'left'"
            class="icon-block__icon"
            :ios="icon"
            :md="icon"
            :style="{'font-size': iconSize+'px', 'min-width': iconSize+'px'}"
        ></ion-icon>
        <div class="icon-block__content">
            <slot></slot>
        </div>
        <ion-icon
            v-if="icon && iconPosition == 'right'"
            class="icon-block__icon"
            :ios="icon"
            :md="icon"
            :style="{'font-size': iconSize+'px', 'min-width': iconSize+'px'}"
        ></ion-icon>
    </div>
</template>

<script>
import { IonIcon } from '@ionic/vue';

export default {
    name:"QuartzIconBlock",
    components: {
        IonIcon
    },
    props: {
        icon: {
            default: ()=>null,
            required: false
        },
        iconSize: {
            default: ()=>27.2,
            required: false
        },
        iconPosition: {
            default: ()=>"left",
            required: false
        },
    },
    data: function(){
        return {
            mainClasses: [
                {'has-icon': this.icon},
                'icon-' + this.iconPosition
            ]
        };
    },
    methods: {
    }
}
</script>

<style scoped>
    .icon-block {
        position: relative;
        font-size: inherit;
        display: flex;
        align-items: center;
    }
    
    .icon-block__icon {
        margin-right: 10.3px;
        color: inherit;
    }
    .icon-right .icon-block__icon {
        margin-right: unset;
        margin-left: 10.3px;
    }    
</style>
