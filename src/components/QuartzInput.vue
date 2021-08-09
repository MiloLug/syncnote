<template>
    <div class="input-block" v-bind:class="mainClasses">
        <ion-icon v-if="icon" class="input-block__icon" :ios="icon" :md="icon"></ion-icon>
        <input
            class="input-block__input"
            :class="inputClasses"
            :placeholder="placeholder"
            :type="fieldType"
            :value="dataValue"
            @input="onInput($event)"
            @change="onChange($event)"
        >
    </div>
</template>

<script>
/*eslint no-control-regex: 0*/

import { IonIcon } from '@ionic/vue';

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
    email: "email"
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
        shadow: {
            default: ()=>"center",
            required: false
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
                'quartz-shadow-' + this.shadow,
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

<style scoped>
    .input-block {
        display: block;
        position: relative;
    }
    

    .input-block__icon {
        position: absolute;
        margin: auto;
        font-size: 24.2px;
        top: calc(50% - 12.1px);
        left: 14px;
	z-index: 1;
    }


    .input-block__input {
        width: 100%;
        outline: none;
        border: none;
        background: transparent;
        height: 50px;
        border-radius: 50px;
        padding: 20px;
        font-size: 16px; 
    }
    .input-block__input[type=number] { 
        -moz-appearance: textfield;
        appearance: textfield;
    }
    .input-block__input[type=number]::-webkit-inner-spin-button, 
    .input-block__input[type=number]::-webkit-outer-spin-button { 
          -webkit-appearance: none; 
    }    
    .input-block__input:focus {
        background: var(--quartz-color-layer-25);
	box-shadow: var(--quartz-neu-shadow-sm-2);
    }

    .has-icon:not(.icon-right) .input-block__input {
        padding-left: 50px;
    }
    .has-icon.icon-right .input-block__input {
        padding-right: 50px;
    }
    .has-icon.icon-right .input-block__icon {
        right: 14px;
        left: unset;
    }
</style>

