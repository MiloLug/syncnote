<template>
    <ion-page>
        <ion-content class="content">
            <form class="data-form" @submit="onSubmit">
                <quartz-input
                    format="login"
                    :icon="personOutline"
                    class="input-line"
                    :placeholder="$lang.tr`Login|field` + ' *'"
                    v-model="username"
                />
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
                <router-link class="link" :to="{name: 'reset-password'}">
                    {{ $lang.tr`Forgot password?` }}
                </router-link>
            </div>

            <quartz-connection-banner/>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage, RouterLink } from '@ionic/vue';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import { keyOutline, personOutline } from 'ionicons/icons';
import QuartzConnectionBanner from "../components/QuartzConnectionBanner";

export default {
    name: 'SignIn',
    components: {
        IonPage,
        QuartzInput,
        QuartzButton,
        RouterLink,
        QuartzConnectionBanner
    },
    data() {
        return {
            keyOutline,
            personOutline,

            username: "",
            password: ""
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            this.signIn();
            return false;
        },
        async signIn() {
            await this.$store.dispatch('user/startAuth', {
                username: this.username,
                password: this.password
            });
            await this.$store.dispatch("note/sync", this.$store.state.user.isAuthenticated);

            this.username = "";
            this.password = "";

            this.$router.push('/');
        }
    }
}
</script>

<style scoped lang="scss">
    .data-form {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 40px;
    }

    .input-line {
        margin: 14px 0px;
        width: calc(100% - 40px);
        
        &.controls {
            text-align: right;
            margin-top: 40px;

            .submit-button {
                width: 100%;
            }
        }
    }

    .links {
        max-width: 100%;
        text-align: right;
        margin: 20px;
        font-size: 15px;
        
        .link {
            color: rgba(var(--quartz-text-color-rgb), 0.7);
        }
    }
    
</style>
