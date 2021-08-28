<template>
    <ion-page>
        <ion-content class="content">
            <form class="data-form" @submit="onSubmit">
                <quartz-input
                    format="login"
                    :icon="folderOpenOutline"
                    class="input-line"
                    :placeholder="tr`Login *`"
                    v-model="karavka"
                />
                <quartz-input
                    format="email"
                    :icon="mailOutline"
                    class="input-line"
                    :placeholder="tr`Email`"
                />
                <quartz-input
                    format="password"
                    :icon="keyOutline"
                    class="input-line"
                    :placeholder="tr`Password *`"
                />
                
                <div class="input-line controls">
                    <quartz-button type="submit" class="submit-button" shadow="center">
                        {{tr`Sign Up`}}
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
import { tr } from '../localization';

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
            karavka: "",
            tr
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
