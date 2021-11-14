<template>
    <div class="banner" v-if="show">
        <div class="bg"></div>
        <div class="content">
            <div class="icon-wrapper">
                <ion-icon
                    class="icon"
                    :ios="wifiOutline"
                    :md="wifiOutline"
                ></ion-icon>
            </div>
            <div class="description">
                {{ $lang.tr`No connection` }}
            </div>
        </div>
    </div>
</template>

<script>

import { IonIcon } from "@ionic/vue";
import { Network, Connection } from "@ionic-native/network";
import { wifiOutline } from "ionicons/icons";

export default {
    name: "QuartzConnectionBanner",
    components: {
        IonIcon
    },

    data() {
        return {
            show: Network.type === Connection.NONE,
            wifiOutline,
            
            connectSubscription: null,
            disconnectSubscription: null
        };
    },

    methods: {
        onConnect() {
            this.show = false;
        },
        onDisconnect() {
            this.show = true;
        },

        subscribe() {
            this.unsubscribe();
            this.connectSubscription = Network.onConnect().subscribe(this.onConnect);
            this.disconnectSubscription = Network.onDisconnect().subscribe(this.onDisconnect);
        },
        unsubscribe() {
            this.connectSubscription?.unsubscribe?.();
            this.disconnectSubscription?.unsubscribe?.();
        }
    },

    mounted() {
        this.subscribe();
    },
    unmounted() {
        this.unsubscribe();
    }
}
</script>

<style lang="scss" scoped>
    .banner {
        position: absolute;        
        z-index: 999999;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;

        .bg {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            background: rgba(0, 0, 0, 0.699);
            z-index: 1;
            backdrop-filter: blur(2px);
        }

        .content {
            position: absolute;
            background: var(--quartz-color-25);
            z-index: 2;
            width: calc(100% - 50px);
            height: 100px;
            top: calc(50% - 100px);
            border-radius: 5px;
            left: 25px;
            padding: 10px;
        }
    }

    .icon-wrapper {
        width: 100%;
        text-align: center;

        .icon {
            font-size: 40px;
        }
    }

    .description {
        margin: 5px 0px;
        text-align: center;
    }
</style>