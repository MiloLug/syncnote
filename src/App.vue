<template>
    <IonApp>
        <ion-router-outlet id="main-content"></ion-router-outlet>
        <quartz-bar id="main-bar" :content="quartzBarContent"></quartz-bar>
    </IonApp>
</template>

<script lang="js">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import QuartzBar from './components/QuartzBar';
import { homeOutline, syncOutline, gridOutline} from 'ionicons/icons';

export default {
    name: "App",
    components: {
        IonApp,
        IonRouterOutlet,
        QuartzBar
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
            stopLoop: false
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
