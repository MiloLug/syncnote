<template>
    <ion-page>
        <ion-content>
            <div class="form-content">
                <form class="data-form" @submit="onSubmit">
                    <quartz-input
                        format="login"
                        :icon="personOutline"
                        class="input-line"
                        :placeholder="$lang.tr`Login|field` + ' *'"
                        v-model="username"
                    />
                    <ul class="errors input-line" v-if="hasErrors && usernameErrors.length">
                        <li class="error" v-for="e in usernameErrors" :key="e">
                            {{ $lang.tr(e) }}
                        </li>
                    </ul>
                    <quartz-input
                        format="password"
                        :icon="keyOutline"
                        class="input-line"
                        :placeholder="$lang.tr`Password` + ' *'"
                        v-model="password"
                    />
                    
                    <div class="input-line controls">
                        <quartz-button type="submit" class="submit-button" shadow="center">
                            {{ $lang.tr`Sign In` }}
                        </quartz-button>
                    </div>
                </form>
                <div class="links">
                    <!-- <router-link class="link" :to="{name: 'reset-password'}">
                        {{ $lang.tr`Forgot password?` }}
                    </router-link> -->
                    <ion-nav-link :router-link="{name: 'reset-password'}" class="link">
                        {{ $lang.tr`Forgot password?` }}
                    </ion-nav-link>
                </div>
            </div>

            <quartz-connection-banner/>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonNavLink, IonContent } from '@ionic/vue';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import { keyOutline, personOutline } from 'ionicons/icons';
import QuartzConnectionBanner from "../components/QuartzConnectionBanner";

export default {
    name: 'SignIn',
    components: {
        IonPage,
        IonContent,
        QuartzInput,
        QuartzButton,
        // RouterLink,
        IonNavLink,
        QuartzConnectionBanner
    },
    data() {
        return {
            keyOutline,
            personOutline,

            username: "",
            password: "",

            hasErrors: false,
            usernameErrors: [],
        };
    },
    methods: {
        cleanErrors() {
            this.hasErrors = false;
            this.usernameErrors = [];
        },
        onSubmit(e) {
            e.preventDefault();
            this.signIn();
            return false;
        },
        async signIn() {
            this.cleanErrors();

            await this.$store.dispatch('note/localizeNotes');

            try{
                await this.$store.dispatch('user/startAuth', {
                    username: this.username,
                    password: this.password
                });
                
                await this.$store.dispatch('note/init', this.$store.state.user.isAuthenticated);

                this.username = '';
                this.password = '';

                this.$router.push('/');
            }
            catch(e) {
                this.hasErrors = !!e;
                this.usernameErrors = e?.username ?? [];
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @use "@/styles/form-page.scss";
</style>
