<template>
    <ion-page>
        <ion-content class="content">
            <div class="form-content">
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
            </div>
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
    @use "@/styles/form-page.scss";
</style>
