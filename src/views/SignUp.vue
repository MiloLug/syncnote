<template>
    <ion-page>
        <ion-content class="content">
            <form class="data-form" @submit="onSubmit">
                <quartz-input
                    format="login"
                    :icon="folderOpenOutline"
                    class="input-line"
                    :placeholder="$lang.tr`Login|field` + ' *'"
                    v-model="username"
                />
                <quartz-input
                    format="email"
                    :icon="mailOutline"
                    class="input-line"
                    :placeholder="$lang.tr`Email`"
                    v-model="email"
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
                        {{ $lang.tr`Sign Up` }}
                    </quartz-button>
                </div>
            </form>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonPage } from '@ionic/vue';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import { pricetagOutline, callOutline, keyOutline, mailOutline, folderOpenOutline } from 'ionicons/icons';

export default {
    name: 'SignUp',
    components: {
        IonPage,
        QuartzInput,
        QuartzButton,
    },
    data() {
        return {
            pricetagOutline,
            callOutline,
            keyOutline,
            mailOutline,
            folderOpenOutline,

            username: "",
            email: "",
            password: ""
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            this.signUp();
            return false;
        },
        async signUp() {
            console.log({
                username: this.username,
                email: this.email,  
                password: this.password
            });
            await this.$store.dispatch('user/startRegister', {
                username: this.username,
                email: this.email || null,
                password: this.password
            });
            await this.$store.dispatch("note/sync", this.$store.state.user.isAuthenticated);
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
    
</style>
