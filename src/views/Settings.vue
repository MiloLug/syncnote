<template>
    <ion-page>
        <ion-content class="content">
            <div class="settings-content">
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
                    <form class="data-form" @submit="onAccountFormSubmit">
                        <quartz-input
                            format="login"
                            :icon="personOutline"
                            class="input-line"
                            :placeholder="$lang.tr`Login|field` + ' *'"
                            v-model="newUsername"
                        />
                        <ul class="errors input-line" v-if="hasErrors && usernameErrors.length">
                            <li class="error" v-for="e in usernameErrors" :key="e">
                                {{ $lang.tr(e) }}
                            </li>
                        </ul>

                        <quartz-input
                            format="email"
                            :icon="mailOutline"
                            class="input-line"
                            :placeholder="$lang.tr`Email`"
                            v-model="newEmail"
                        />
                        <ul class="errors input-line" v-if="hasErrors && emailErrors.length">
                            <li class="error" v-for="e in emailErrors" :key="e">
                                {{ $lang.tr(e) }}
                            </li>
                        </ul>

                        <quartz-divider/>
                        <quartz-input
                            format="password"
                            :icon="keyOutline"
                            class="input-line"
                            :placeholder="$lang.tr`Old password`"
                            v-model="oldPassword"
                        />
                        <ul class="errors input-line" v-if="hasErrors && oldPasswordErrors.length">
                            <li class="error" v-for="e in oldPasswordErrors" :key="e">
                                {{ $lang.tr(e) }}
                            </li>
                        </ul>

                        <quartz-input
                            format="password"
                            :icon="keyOutline"
                            class="input-line"
                            :placeholder="$lang.tr`New password`"
                            v-model="newPassword"
                        />
                        <ul class="errors input-line" v-if="hasErrors && newPasswordErrors.length">
                            <li class="error" v-for="e in newPasswordErrors" :key="e">
                                {{ $lang.tr(e) }}
                            </li>
                        </ul>
                        
                        <div class="input-line controls">
                            <quartz-button type="submit" class="submit-button" shadow="center">
                                {{ $lang.tr`Save` }}
                            </quartz-button>
                        </div>
                    </form>
                    <div class="description" v-html="$lang.tr`account settings description`"></div>

                    <quartz-connection-banner/>
                </div>

                <div class="settings-block" v-if="$store.state.user.isAuthenticated">
                    <div class="title">{{ $lang.tr`Dangerous|settings section` }}</div>
                    <div class="input-line controls">
                        <quartz-button class="submit-button delete-user" shadow="center" @click="onBtnDeleteUserClick">
                            {{ $lang.tr`Remove account` }}
                        </quartz-button>
                    </div>

                    <quartz-connection-banner/>
                </div>
            </div>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonContent, IonPage, IonSelect, IonSelectOption } from '@ionic/vue';
import QuartzButton from "../components/QuartzButton";
import QuartzDivider from "../components/QuartzDivider";
import QuartzInput from "../components/QuartzInput";
import QuartzConnectionBanner from "../components/QuartzConnectionBanner";
import { keyOutline, mailOutline, personOutline } from 'ionicons/icons';


export default {
    name: 'Settings',

    components: {
        IonContent,
        IonPage,
        QuartzButton,
        IonSelect,
        IonSelectOption,
        QuartzDivider,
        QuartzInput,
        QuartzConnectionBanner
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
        },
        username() { return this.$store.state.user.username; },
        email() { return this.$store.state.user.email; }
    },

    watch: {
        username(value) { this.newUsername = value; },
        email(value) { this.newEmail = value; }
    },

    data() {
        return {
            keyOutline,
            mailOutline,
            personOutline,

            newUsername: this.$store.state.user.username,
            newEmail: this.$store.state.user.email,
            oldPassword: "",
            newPassword: "",


            hasErrors: false,
            usernameErrors: [],
            emailErrors: [],
            oldPasswordErrors: [],
            newPasswordErrors: [],
        };
    },

    methods: {
        cleanErrors() {
            this.hasErrors = false;
            this.usernameErrors = [];
            this.emailErrors = [];
            this.oldPasswordErrors = [];
            this.newPasswordErrors = [];
        },
        
        onBtnThemeClick(theme) {
            this.$store.dispatch('user/setTheme', theme);
        },

        onAccountFormSubmit(e) {
            e.preventDefault();
            this.updateAccount();
            return false;
        },
        async updateAccount() {
            this.cleanErrors();

            const data = {
                email: this.newEmail,
                username: this.newUsername
            };
            if (this.newPassword)
                data.newPassword = this.newPassword,
                data.oldPassword = this.oldPassword;

            try {
                await this.$store.dispatch('user/updateUserData', data);
                this.oldPassword = "";
                this.newPassword = "";
            }
            catch(e) {
                this.hasErrors = !!e;
                this.usernameErrors = e?.username ?? [];
                this.emailErrors = e?.email ?? [];
                this.oldPasswordErrors = e?.old_password ?? [];
                this.newPasswordErrors = e?.new_password ?? [];
            }
        },

        async onBtnDeleteUserClick() {
            if (prompt(this.$lang.tr`account deleteion confirmation`) === this.$lang.tr`account deleteion confirmation response`) {
                await this.$store.dispatch('note/sync');
                await this.$store.dispatch('user/deleteAccount');
                await this.$store.dispatch('note/localizeNotes');
            }
        }
    },
}
</script>

<style lang="scss" scoped>
    @use "@/styles/utils/tools.scss";

    .settings-content {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        justify-content: space-evenly;
        flex-direction: row;
        align-content: space-between;
    }

    .settings-block {
        background: rgba(var(--quartz-color-4-rgb), 0.5);
        padding: 1.5px 17.5px 8px 17.5px;
        border-radius: 10px;
        margin: 13.5px;
        overflow: hidden;
        position: relative;
        width: 100%;
        max-width: 700px;

        > .title {
            margin: 10px 0px;
        }

        &:nth-child(even) {
            background: var(--quartz-color-4);
        }
    }

    .data-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;
    }

    .input-line {
        margin: 14px auto;
        width: calc(100% - 40px);
        
        &.controls {
            text-align: right;
            margin-top: 40px;

            .submit-button {
                width: 100%;

                &.delete-user {
                    background: rgba(var(--ion-color-danger-rgb), .5);
                }
            }
        }

        &.errors {
            margin-top: 0px;
            font-size: 13px;
            background: linear-gradient(to right, rgba(var(--ion-color-danger-rgb), 0.4), transparent);
            border-radius: 10px;
            padding: 2px 10px 5px 20px;

            .error {
                color: rgba(var(--quartz-text-color-rgb), 0.8);
            }
        }
    }

    .description {
        margin: 20px;
        margin-top: 40px;
        font-size: 12px;
        background: rgba(var(--quartz-color-4-rgb), 0.5);
        padding: 21px;
        border-radius: 10px;
        color: rgba(var(--quartz-text-color-rgb), 0.8);
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


    @media screen and (min-width: 820px) {
        .settings-block {
            max-width: 380px;
            min-width: 380px;

            &:nth-child(1n) {
            background: var(--quartz-color-4);
            }
            &:nth-child(2n), &:nth-child(3n) {
                background: rgba(var(--quartz-color-4-rgb), 0.5);
            }
            &:nth-child(4n) {
                background: var(--quartz-color-4);
            }
        }
    }
    @media screen and (min-width: 1000px) {
        .settings-block {
            max-width: 470px;
            min-width: 400px;
        }
    }

    @media screen and (min-width: 1380px) {
        .settings-block {
            max-width: 600px;
        }
    }

    @media screen and (min-width: 1480px) {
        .settings-block {
            min-width: 700px;
            max-width: 700px;
            margin: 13.5px calc(10% - 140px) 13.5px calc(40% - 560px);
            
            &:nth-child(even) {
                margin: 13.5px calc(40% - 560px) 13.5px calc(10% - 140px);
            }
        }
    }
</style>
