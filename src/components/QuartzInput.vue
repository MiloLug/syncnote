<template>
    <div class="input-block" v-bind:class="mainClasses">
        <ion-icon v-if="icon" class="icon" :ios="icon" :md="icon"></ion-icon>
        <input
            class="input"
            :class="inputClasses"
            :placeholder="placeholder"
            :type="fieldType"
            :value="dataValue"
            :style="cssVars"
            @input="onInput($event)"
            @change="onChange($event)"
            ref="input"
        >
    </div>
</template>

<script>
/*eslint no-control-regex: 0*/

import { IonIcon } from '@ionic/vue';
import styleProps, {applyClasses, applyCss} from '../mixins/style-props.js';


const formatsPiping = {
    text(newVal, oldVal=""){
        return newVal != undefined ? newVal : oldVal;
    },

    decimal(newVal, oldVal="0") {
        if(newVal?.constructor === String){
            newVal = newVal.trim();
            return (/^(-|\+|)$/).test(newVal)
                ? newVal
                : (/(?:-|\+|)(?:\d+(?:\.|)\d*|\d*(?:\.|)\d+)/mi)
                    .exec(newVal)?.[0] ?? oldVal;
        }else{
            if(!isNaN(newVal)) return newVal;
        }
        return oldVal;
    },

    integer(newVal, oldVal="0") {
        if(newVal?.constructor === String){
            newVal = newVal.trim();
            return (/^(-|\+|)$/).test(newVal)
                ? newVal
                : (/(?:-|\+|)\d+/mi).exec(newVal)?.[0] ?? oldVal;
        }else{
            if(!isNaN(newVal)) return newVal;
        }
        return oldVal;
    },

    phone(newVal, oldVal="") {
        if(newVal?.constructor === String){
            newVal = newVal.trim();
            if((/^(\+|)$/).test(newVal))
                return newVal
            const match = (/\d{1,15}/mi).exec(newVal)?.[0];
            return match ? '+' + match : oldVal;
        }
        return oldVal;
    },

    login(newVal, oldVal="") {
        return newVal?.constructor === String
            ? (/(\w|-|_|\$)*/gmi).exec(newVal.trim())?.[0] ?? oldVal
            : oldVal;
    },

    email(newVal, oldVal="") {
        if(newVal?.constructor === String){
            newVal = newVal.trim();
            return (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\]).?/gmi).exec(newVal)?.[0]
		|| (/(?:[a-z0-9!#$%&'*+/=?^_`{|}.~-]+|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")(?:@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.?)+|\[(?:(?:(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){0,3}(?:(?:2(?:5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f]|)+|)|)\]?|)|)/gmi).exec(newVal)?.[0]
                || "";
        }
        return oldVal;
    }
};
function pipeValue(format, ...args) {
    const filtered = formatsPiping[format]
        ? formatsPiping[format](...args)
        : args[0];

    if(args.length === 1)
        return filtered;

    if(args.length > 1) {
        const newVal = args[0],
            oldVal = args[1];
        return filtered.length < oldVal.length && newVal.length > oldVal.length
            ? oldVal
            : filtered;
    }
}

const fieldTypeFormatting = {
    phone: "phone",
    password: "password",
    email: "email",
    login: "login"
};

export default {
    name:"QuartzInput",
    components: {
        IonIcon
    },
    props: {
        format: {
            default: ()=>"text",
            required: false,
        },
        modelValue: {
            default: ()=>"",
            required: false
        },
        icon: {
            default: ()=>null,
            required: false
        },
        placeholder: {
            default: ()=>"",
            required: false 
        },
        iconPosition: {
            default: ()=>"left",
            required: false
        },
        ...styleProps,
        shadow: {
            default: ()=>"2-neu-soft"
        },
        innerShadow: {
            default: ()=>"2-neu-concave-soft"
        },
        borderColor: {
            default: ()=>"var(--quartz-color-0)" 
        },
        borderWidth: {
            default: ()=>"2px"
        },
        quartzFocus: {
            default: ()=>"true"
        }
    },

    watch: {
        modelValue(value) {
            if(value === this.dataValue)
                return;

            this.dataValue = pipeValue(this.format, value, this.dataValue);
        }
    },

    data: function(){
        return {
            dataValue: pipeValue(this.format, this.modelValue),
            fieldType: fieldTypeFormatting[this.format] || "text",
            mainClasses: [
                {'has-icon': this.icon},
                'icon-' + this.iconPosition
            ],
            inputClasses: [
                ...applyClasses(this)
            ],
            cssVars: [
                ...applyCss(this)
            ]
        };
    },
    methods: {
        onInput(e){
            const value = e.target.value;
            this.dataValue = pipeValue(this.format, value, this.dataValue);
            this.$forceUpdate();
            this.$emit("update:modelValue", this.dataValue);
        },
        onChange(e){
            const value = e.target.value;
            this.dataValue = pipeValue(this.format, value, this.dataValue);
            this.$forceUpdate();
            this.$emit("change", this.dataValue);
        }
    }
}
</script>

<style scoped lang="scss">
    @use "@/styles/utils/tools.scss";

    .input-block {
        display: block;
        position: relative;
    
        .icon {
            position: absolute;
            margin: auto;
            font-size: 24.2px;
            top: calc(50% - 12.1px);
            left: 14px;
            z-index: 1;
            --ionicon-stroke-width: 20;
        }

        
        .input {
            @include tools.placeholder {
                color: rgba(var(--quartz-color-1-contrast-rgb), 0.6);
            }

            width: 100%;
            outline: none;
            border: none;
            background: transparent;
            height: 50px;
            border-radius: 50px;
            padding: 20px;
            font-size: 16px;

            &.has-borderColor.has-borderWidth {
                border-style: solid;
            }
            
            &[type=number] { 
                -moz-appearance: textfield;
                appearance: textfield;
            }
            &[type=number]::-webkit-inner-spin-button, 
            &[type=number]::-webkit-outer-spin-button { 
                -webkit-appearance: none; 
            }    
            
            &:focus {
                background: var(--quartz-color-25);
            }
        }
    
        &.has-icon:not(.icon-right) {
            .input {
                padding-left: 50px;
            }
        }
        
        &.has-icon.icon-right {
            .input {
                padding-right: 50px;
            }
            
            .icon {
                right: 14px;
                left: unset;
            }
        }
    }
</style>
