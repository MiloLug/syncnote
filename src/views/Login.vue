<template>
    <ion-page>
        <ion-content class="content" forceOverscroll="false" overflow-scroll="false" no-bounce>
            <form class="data-form" @submit="onSubmit">
                <quartz-input
                    format="login"
                    :icon="folderOpenOutline"
                    class="input-line"
                    placeholder="имя"
                    v-model="karavka"
                />
                <quartz-input
                    format="decimal"
                    :icon="pricetagOutline"
                    class="input-line"
                    placeholder="пачём грибы (грн)"
                />
                <quartz-input
                    format="phone"
                    :icon="callOutline"
                    class="input-line"
                    placeholder="телефончек"
                />
                <quartz-input
                    format="password"
                    :icon="keyOutline"
                    class="input-line"
                    placeholder="пароль"
                />
                <quartz-input
                    format="email"
                    :icon="mailOutline"
                    class="input-line"
                    placeholder="email"
                />
                <div class="input-line controls">
                    <quartz-button type="submit" class="submit-button" shadow="center">
                        Sign up
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
    name: 'Login',
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
            karavka: ""
        };
    },
    methods: {
        test() {
            console.log(this.karavka);
        },
        onSubmit(e) {
            e.preventDefault();
            return false;
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
