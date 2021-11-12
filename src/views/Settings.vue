<template>
    <ion-page>
        <ion-content class="content">
            <div class="settings-block">
                <div class="title">{{ $lang.tr`Theme|settings section` }}</div>
                <div class="row-selector">
                    <quartz-button
                        class="item empty"
                        quartzActive="false"
                        @click="onBtnThemeClick('auto')"
                    ></quartz-button>
                    <quartz-button
                        class="item"
                        quartzActive="false"
                        @click="onBtnThemeClick('dark')"
                        style="--item-color: black;"
                    ></quartz-button>
                    <quartz-button
                        class="item"
                        quartzActive="false"
                        @click="onBtnThemeClick('light')"
                        style="--item-color: white;"
                    ></quartz-button>
                </div>
            </div>
            <div class="settings-block">
                <div class="title">{{ $lang.tr`Language|settings section` }}</div>
                <ion-select class="lang-selector" interface="popover" v-model="lang">
                    <ion-select-option value="uk">{{ $langDictionaries.uk['*'].__lang_name__ }}</ion-select-option>
                    <ion-select-option value="en-us">{{ $langDictionaries.en['*'].__lang_name__ }}</ion-select-option>
                </ion-select>
            </div>
            <div class="settings-block" v-if="$store.state.user.isAuthenticated">
                <div class="title">{{ $lang.tr`Account|settings section` }}</div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/vue';
import QuartzButton from "../components/QuartzButton";


export default {
    name: 'Settings',

    components: {
        IonContent,
        IonPage,
        QuartzButton,
        IonSelect,
        IonSelectOption
    },

    computed: {
        lang: {
            get() {
                return this.$lang.tr`__lang_code__`;
            },
            set(value) {
                this.$lang.setLang(value);
                this.$store.dispatch('user/setLang', value);
            }
        }
    },

    data() {
        return {
        };
    },

    methods: {
        onBtnThemeClick(theme) {
            this.$store.dispatch('user/setTheme', theme);
        },
    },
}
</script>

<style lang="scss" scoped>
    @use "@/styles/utils/tools.scss";

    .settings-block {
        background: rgba(var(--quartz-color-4-rgb), 0.5);
        padding: 1.5px 7px 8px 17.5px;
        border-radius: 10px;
        margin: 13.5px;

        > .title {
            margin: 10px 0px;
        }

        &:nth-child(even) {
            background: var(--quartz-color-4);
        }
    }

    .divider {
        margin: 24px 0px;
    }

    .row-selector {
        overflow: auto;
        max-width: 100%;
        position: relative;
        display: flex;
        margin: 2px 0px;
        height: 50px;
        align-items: center;

        &.icons .item {
            border: 1px solid var(--quartz-color-4-contrast);
        }

        .item {
            min-width: 36px;
            min-height: 36px;
            padding: 0px;
            width: 36px;
            height: 36px;
            background-color: var(--item-color);
            border-radius: 50px;
            margin: 2px 5px;
            box-shadow: var(--quartz-shadow-2-neu);

            &.empty {
                background: transparent;
                border: 2px solid var(--quartz-color-4-contrast);
            }

            .icon {
                font-size: 19px;
            }

            &:active {
                box-shadow: var(--quartz-shadow-2-neu-soft);
            }
        }            
    }

    .lang-selector {
        max-width: 250px;
        height: 50px;
        background: var(--quartz-color-15);
        border-radius: 50px;
        box-shadow: var(--quartz-shadow-2-neu);
        padding-right: 10px;
        padding-left: 20px;
        margin: 20px 0px;
    }

</style>
