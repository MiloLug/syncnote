<template>
  <!-- <IonApp>
    <IonSplitPane content-id="main-content">
      <ion-menu content-id="main-content" type="overlay">
        <ion-content>
          <ion-list id="inbox-list">
            <ion-list-header>Inbox</ion-list-header>
            <ion-note>hi@ios.com</ion-note>
  
            <ion-menu-toggle auto-hide="false" v-for="(p, i) in appPages" :key="i">
              <ion-item @click="selectedIndex = i" router-direction="root" :router-link="p.url" lines="none" detail="false" class="hydrated" :class="{ selected: selectedIndex === i }">
                <ion-icon slot="start" :ios="p.iosIcon" :md="p.mdIcon"></ion-icon>
                <ion-label>{{ p.title }}</ion-label>
              </ion-item>
            </ion-menu-toggle>
          </ion-list>
  
          <ion-list id="labels-list">
            <ion-list-header>Labels</ion-list-header>
  
            <ion-item v-for="(label, index) in labels" lines="none" :key="index">
              <ion-icon slot="start" :ios="bookmarkOutline" :md="bookmarkSharp"></ion-icon>
              <ion-label>{{ label }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </IonSplitPane>
  </IonApp> -->
    <IonApp>
        <ion-router-outlet id="main-content"></ion-router-outlet>
        <quartz-bar id="main-bar" v-bind:content="quartzBarContent"></quartz-bar>
    </IonApp>
</template>

<script lang="js">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import QuartzBar from './components/QuartzBar';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { lockOpenOutline, homeOutline, syncOutline, gridOutline} from 'ionicons/icons';

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
                {
                    icon: homeOutline,
                    name: 'Home',
                    action: () => this.$router.push("/")
                },
                {
                    icon: syncOutline,
                    name: 'Syncronization',
                    items: this.$store.state.user.isAuthenticated
                        ? [
                            {
                                name: 'Log Out',
                                action: async () => {
                                    this.$router.push('/');
                                    await this.$store.dispatch('note/applyIdPairs');
                                    await this.$store.dispatch('user/logout');
                                }
                            }
                        ]
                        : [
                            {
                                name: 'Sign Up',
                                action: () => this.$router.push({name: "sign-up"})
                            }, {
                                name: 'Sign In',
                                action: () => this.$router.push({name: "sign-in"})
                            }
                        ]
                },
                {
                    icon: gridOutline,
                    name: 'Settings',
                    action: () => this.$router.push({name: "settings"})
                }
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
            await this.saveLocalNotes();
            setTimeout(loop, 5000);
        };

        window.gg = this.$store;
    },
    methods: {
        // openScanner: async function(){
        //   this.lol = (await BarcodeScanner.scan()).text;
        // }
        onKeyboardDidShow() {
            this.$nextTick(()=>document.querySelector('body').classList.add('keyboard-on'));
        },
        onKeyboardDidHide() {
            document.querySelector('body').classList.remove('keyboard-on');
        },
        async saveLocalNotes() {
            await this.$store.dispatch('note/saveLocalNotes');
        }
    },
    unmounted() {
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
        window.removeEventListener('beforeunload', this.saveLocalNotes);
        document.removeEventListener("pause", this.saveLocalNotes);
        document.removeEventListener("resign", this.saveLocalNotes);

        this.stopLoop = true;
    },
}
// import { IonApp, IonContent, IonIcon, IonItem, IonLabel, IonList, IonListHeader, IonMenu, IonMenuToggle, IonNote, IonRouterOutlet, IonSplitPane } from '@ionic/vue';
// import { defineComponent, ref } from 'vue';
// import { useRoute } from 'vue-router';
// import { archiveOutline, archiveSharp, bookmarkOutline, bookmarkSharp, heartOutline, heartSharp, mailOutline, mailSharp, paperPlaneOutline, paperPlaneSharp, trashOutline, trashSharp, warningOutline, warningSharp } from 'ionicons/icons';

// export default defineComponent({
//   name: 'App',
//   components: {
//     IonApp, 
//     IonContent, 
//     IonIcon, 
//     IonItem, 
//     IonLabel, 
//     IonList, 
//     IonListHeader, 
//     IonMenu, 
//     IonMenuToggle, 
//     IonNote, 
//     IonRouterOutlet, 
//     IonSplitPane,
//   },
//   setup() {
//     const selectedIndex = ref(0);
//     const appPages = [
//       {
//         title: 'Inbox',
//         url: '/folder/Inbox',
//         iosIcon: mailOutline,
//         mdIcon: mailSharp
//       },
//       {
//         title: 'Outbox',
//         url: '/folder/Outbox',
//         iosIcon: paperPlaneOutline,
//         mdIcon: paperPlaneSharp
//       },
//       {
//         title: 'Favorites',
//         url: '/folder/Favorites',
//         iosIcon: heartOutline,
//         mdIcon: heartSharp
//       },
//       {
//         title: 'Archived',
//         url: '/folder/Archived',
//         iosIcon: archiveOutline,
//         mdIcon: archiveSharp
//       },
//       {
//         title: 'Trash',
//         url: '/folder/Trash',
//         iosIcon: trashOutline,
//         mdIcon: trashSharp
//       },
//       {
//         title: 'Spam',
//         url: '/folder/Spam',
//         iosIcon: warningOutline,
//         mdIcon: warningSharp
//       }
//     ];
//     const labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
    
//     const path = window.location.pathname.split('folder/')[1];
//     if (path !== undefined) {
//       selectedIndex.value = appPages.findIndex(page => page.title.toLowerCase() === path.toLowerCase());
//     }
    
//     const route = useRoute();
    
//     return { 
//       selectedIndex,
//       appPages, 
//       labels,
//       archiveOutline, 
//       archiveSharp, 
//       bookmarkOutline, 
//       bookmarkSharp, 
//       heartOutline, 
//       heartSharp, 
//       mailOutline, 
//       mailSharp, 
//       paperPlaneOutline, 
//       paperPlaneSharp, 
//       trashOutline, 
//       trashSharp, 
//       warningOutline, 
//       warningSharp,
//       isSelected: (url: string) => url === route.path ? 'selected' : ''
//     }
//   }
// });
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
