<template>
    <IonApp>
        <ion-router-outlet id="main-content"></ion-router-outlet>
        <quartz-bar id="main-bar" :content="quartzBarContent"></quartz-bar>
        <div class="notifications">
            <div
                class="notification"
                v-for="notification in $store.state.notifications"
                :key="notification"
                :class="[notification.type]"
            >
                <div class="type-icon">
                    <ion-icon
                        v-if="notification.type === 'danger'"
                        class="icon"
                        :ios="alertOutline"
                        :md="alertOutline"
                    />
                    <ion-icon
                        v-if="notification.type === 'info'"
                        class="icon"
                        :ios="informationOutline"
                        :md="informationOutline"
                    />
                </div>
                <div class="content" v-html="notification.text"></div>
            </div>
        </div>
    </IonApp>
</template>

<script lang="js">
import { IonApp, IonIcon, IonRouterOutlet } from '@ionic/vue';
import QuartzBar from './components/QuartzBar';
import { homeOutline, syncOutline, gridOutline, alertOutline, informationOutline} from 'ionicons/icons';

export default {
    name: "App",
    components: {
        IonApp,
        IonRouterOutlet,
        QuartzBar,
        IonIcon
    },
    computed: {
        quartzBarContent() {
            return [
                {name: 'Home', icon: homeOutline, action: this.onBarHome},
                {
                    name: 'Syncronization',
                    icon: syncOutline,
                    items: this.$store.state.user.isAuthenticated
                        ? [
                            {name: 'Log Out', action: this.onBarLogOut}
                        ]
                        : [
                            {name: 'Sign Up', action: this.onBarSignUp},
                            {name: 'Sign In', action: this.onBarSignIn}
                        ]
                },
                {name: 'Settings', icon: gridOutline, action: this.onBarSettings}
            ];
        }
    },
    data() {
        return {
            stopLoop: false,
            alertOutline,
            informationOutline
        };
    },

    mounted() {
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);
        window.addEventListener('beforeunload', this.saveLocalNotes);
        document.addEventListener("pause", this.saveLocalNotes, false);
        document.addEventListener("resign", this.saveLocalNotes, false);

        const loop = async () => {
            if(this.stopLoop) return;
            if(this.$store.state.user.isAuthenticated)
                await this.$store.dispatch('note/saveRemoteNotes');
            await this.$store.dispatch('note/saveLocalNotes');
            setTimeout(loop, 5000);
        };
        loop();

        window.gg = this.$store;
    },
    methods: {
        onKeyboardDidShow() {
            this.$nextTick(()=>document.querySelector('body').classList.add('keyboard-on'));
        },
        onKeyboardDidHide() {
            document.querySelector('body').classList.remove('keyboard-on');
        },

        async saveLocalNotes() {
            await this.$store.dispatch('note/saveLocalNotes');
        },

        onBarSignUp() { this.$router.push({name: "sign-up"}); },
        onBarSignIn() { this.$router.push({name: "sign-in"}); },
        async onBarLogOut() { 
            this.$router.push('/');
            await this.$store.dispatch('note/applyIdPairs');
            await this.$store.dispatch('user/logout');
        },
        onBarHome() { this.$router.push("/"); },
        onBarSettings() { this.$router.push({name: "settings"}) }
    },
    unmounted() {
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
        window.removeEventListener('beforeunload', this.saveLocalNotes);
        document.removeEventListener("pause", this.saveLocalNotes);
        document.removeEventListener("resign", this.saveLocalNotes);

        this.stopLoop = true;
    },
};
</script>

<style lang="scss" scoped>
    .notifications {
        position: fixed;
        right: 5px;
        overflow: auto;
        display: inline-block;
        max-height: 100%;
        max-width: 290px;
        width: 90%;

        .notification {
            position: relative;
            background: rgba(var(--ion-color-primary-rgb), .9);
            max-width: 280px;
            border-radius: 6px 5px 5px 6px;
            padding: 10px;
            margin: 5px;
            padding-left: 25px;
            
            .type-icon {
                position: absolute;
                top: 0;
                left: 0;
                height: 100%;
                width: 20px;
                display: flex;
                justify-content: center;
                align-items: center;
                background: rgba(var(--quartz-color-4-rgb), .4);
                border-radius: 5px;
                
                .icon {
                    font-size: 20px;
                    min-width: 20px;
                }
            }

            &.danger {
                background: rgba(var(--ion-color-danger-rgb), .9);
            }
        }
    }
</style>

<style lang="scss">
    #main-content {
        height: calc(100% - 50px);
    }
    #main-bar {
        display: initial;
    }
    
    .keyboard-on {
        #main-bar {
            display: none;
        }
        #main-content {
            height: 100%;
        }
    }
</style>
