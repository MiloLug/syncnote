<template>
    <ion-page>
        <ion-content class="content">
            <form class="data-form" @submit="onSubmit">
                <quartz-input
                    format="email"
                    :icon="mailOutline"
                    class="input-line"
                    :placeholder="$lang.tr`Email` + ' *'"
                    v-model="email"
                />
                
                <div class="input-line controls">
                    <quartz-button type="submit" class="submit-button" shadow="center">
                        {{ $lang.tr`Send|password reset` }}
                    </quartz-button>
                </div>
            </form>
            <div class="description" v-html="$lang.tr`reset password description`"></div>

            <quartz-connection-banner/>
        </ion-content>
    </ion-page>
</template>

<script lang="js">
import { IonContent, IonPage } from '@ionic/vue';
import QuartzInput from '../components/QuartzInput';
import QuartzButton from '../components/QuartzButton';
import { mailOutline } from 'ionicons/icons';
import QuartzConnectionBanner from "../components/QuartzConnectionBanner";

export default {
    name: 'ResetPassword',
    components: {
        IonPage,
        IonContent,
        QuartzInput,
        QuartzButton,
        QuartzConnectionBanner
    },
    data() {
        return {
            mailOutline,
            fromRoute: null,

            email: "",
        };
    },
    methods: {
        onSubmit(e) {
            e.preventDefault();
            this.initReset();
            return false;
        },

        async initReset() {
            if (!this.email)
                return;

            await this.$store.dispatch('user/resetPasswordInit', {
                email: this.email,
                time: 5000
            });
            this.$store.dispatch('placeNotification', {
                text: this.$lang.tr`Restore email sent to ...` + this.email
            });

            this.email = "";

            this.$router.go(-1);
        }
    },
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

    .description {
        margin: 20px;
        margin-top: 60px;
        font-size: 12px;
        background: rgba(var(--quartz-color-4-rgb), 0.5);
        padding: 21px;
        border-radius: 10px;
        color: rgba(var(--quartz-text-color-rgb), 0.8);
    }
    
</style>
