<template>
    <div v-bind:class="{expanded: isExpanded}">
        <div
            class="quartz-bar-bg"
            v-bind:class="{expanded: isExpanded}"
            @click="barBgOnClick"
        ></div>
        <div class="quartz-bar">
            <div class="quartz-bar__primary-nav">
                <button
                    class="quartz-bar__primary-nav__entry"
                    v-for="entry in content"
                    @click="entryOnClick(entry)"
                    v-bind:key="entry"
                >
                    <ion-icon 
                        class="quartz-bar__primary-nav__icon"
			:md="entry.icon"
                        :ios="entry.icon"
                    ></ion-icon>
                </button>
            </div>
            <div class="quartz-bar__sub-nav-scroll">
                <div class="quartz-bar__sub-nav">
                    <button
                        class="quartz-bar__sub-nav__item"
                        v-for="item in currentEntry.items"
                        @click="entryOnClick(item)"
                        v-bind:key="item"
                    >
                        <div class="name">{{item.name}}</div>
                    </button>
                </div>
            </div>
            <div class="quartz-bar__sub-nav-tint"></div>
        </div>
    </div>
</template>

<script>
import { IonIcon } from '@ionic/vue';

function validateEntry(entry, requiredIcon=true) {
    return (
        !entry.name  // each entry has to have a name
        || (requiredIcon && !entry.icon)  // and icon (optional)
        || (!entry.action && !entry.items)  // also, action or sub-entries
        || (entry.items && entry.items.some(
                item => !validateEntry(item, false)
            ))  // end all of the above for the sub-entries
    );
}


export default {
    name:"QuartzBar",
    components: {
        IonIcon
    },
    props: {
        content: {
            defauld: ()=>[],
            required: true,
            validator: content => {
                for(const entry of content){
                    if(!validateEntry(entry)) return false;
                }
                return true;
            }
        }
    },
    data: function(){
        return {
            isExpanded: false,
            currentEntry: {}
        };
    },
    methods: {
        expandWith(entry) {
            this.isExpanded = true;
            this.currentEntry = entry || {};
            this.$emit("expand", entry || null);
        },
        close() {
            this.isExpanded = false;
            this.$emit("close");
        },
        entryOnClick(entry) {
            entry?.action
                ? (this.close(), entry.action())
                : this.expandWith(entry);
        },
	
        barBgOnClick() {
            this.close();
        }
    }
}
</script>

<style scoped>
    .quartz-bar {
        position: fixed;
        display: flex;
        flex-direction: column;
        bottom: -250px;
        width: 100%;
        height: 300px;
        background: var(--quartz-control-panel-color); 
        border-radius: 20px 20px 0px 0px;
        box-shadow: 0px 0px 14px 0px rgba(0,0,0,0.07);
        transition: transform .2s cubic-bezier(0,0,.58,1);
        overflow: hidden;
    }
    .expanded .quartz-bar {
        transform: translate(0px, -250px);
    }


    .quartz-bar-bg {
        display: block;
	position: fixed;
        width: 100%;
        height: 100%;
        top: -100%;
        left: 0;
        opacity: 0;
        background-color: #23242636;
        transition: opacity .2s, top 0s .2s;
    }
    .expanded .quartz-bar-bg {
        top: 0;
        opacity: 1;
        transition: opacity .2s;
    }

    
    .quartz-bar__primary-nav {
        display: flex;
        justify-content: space-around;
        align-items: center;
        height: 50px;
        min-height: 50px;
        box-shadow: 0px 0px 50px 16px var(--quartz-control-panel-color);
    }

    .quartz-bar__primary-nav__icon{
        font-size: 20px;
    }

    .quartz-bar__primary-nav__entry {
        outline: none;
	text-align: center;
        flex-grow: 1;
	cursor: pointer;
        background: transparent;
    }


    .quartz-bar__sub-nav {
        margin: 20px 46px 20px 17px;
    }

    .quartz-bar__sub-nav__item {
        outline: none;
	display: block;
        width: 100%;
        height: auto;
        margin: 10px 0px;
        padding: 15px 10px 15px 28px;
        border-radius: 50px;
        text-align: left;
        font-size: 16px;
        background: transparent;
        cursor: pointer;
        box-shadow: 27px 0px 14px 0px rgba(0,0,0,0.03);
    }


    .quartz-bar__sub-nav-scroll {
        overflow: auto;
    }


    .quartz-bar__sub-nav-tint {
        display: none;
        width: 100%;
        height: 20px;
        position: fixed;
        bottom: -20px;
        left: 0px;
        box-shadow: 0px 0px 50px 16px var(--quartz-color-layer-3);
    }
    .expanded .quartz-bar__sub-nav-tint {
        display: block;
    }
</style>

