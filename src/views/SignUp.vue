<template>
    <ion-page>
        <ion-content class="content">
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
                        format="email"
                        :icon="mailOutline"
                        class="input-line"
                        :placeholder="$lang.tr`Email`"
                        v-model="email"
                    />
                    <ul class="errors input-line" v-if="hasErrors && emailErrors.length">
                        <li class="error" v-for="e in emailErrors" :key="e">
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
                    <ul class="errors input-line" v-if="hasErrors && passwordErrors.length">
                        <li class="error" v-for="e in passwordErrors" :key="e">
                            {{ $lang.tr(e) }}
                        </li>
                    </ul>
                    
                    <div class="input-line controls">
                        <quartz-button type="submit" class="submit-button" shadow="center">
                            {{ $lang.tr`Sign Up` }}
                        </quartz-button>
                    </div>
                </form>
            </div>

            <quartz-connection-banner/>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, IonContent } from '@ionic/vue';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import { keyOutline, mailOutline, personOutline } from 'ionicons/icons';
import QuartzConnectionBanner from "../components/QuartzConnectionBanner";

export default {
    name: 'SignUp',
    components: {
        IonPage,
        QuartzInput,
        QuartzButton,
        QuartzConnectionBanner,
        IonContent
    },
    data() {
        return {
            keyOutline,
            mailOutline,
            personOutline,

            username: "",
            email: "",
            password: "",

            hasErrors: false,
            usernameErrors: [],
            emailErrors: [],
            passwordErrors: [],
        };
    },
    methods: {
        cleanErrors() {
            this.hasErrors = false;
            this.usernameErrors = [];
            this.emailErrors = [];
            this.passwordErrors = [];
        },
        onSubmit(e) {
            e.preventDefault();
            this.signUp();
            return false;
        },
        async signUp() {
            this.cleanErrors();

            await this.$store.dispatch('note/localizeNotes');

            try{
                await this.$store.dispatch('user/startRegister', {
                    username: this.username,
                    email: this.email || null,
                    password: this.password
                });

                await this.$store.dispatch('note/init', this.$store.state.user.isAuthenticated);
                
                this.$router.push('/');

                this.username = '';
                this.email = '';
                this.password = '';
            }
            catch(e) {
                this.hasErrors = !!e;
                this.usernameErrors = e?.username ?? [];
                this.emailErrors = e?.email ?? [];
                this.passwordErrors = e?.password ?? [];
            }
        }
    }
}
</script>

<style scoped lang="scss">
    @use "@/styles/form-page.scss";
</style>
