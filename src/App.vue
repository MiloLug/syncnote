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
import { tr } from './localization';

export default {
    name: "App",
    components: {
        IonApp,
        IonRouterOutlet,
        QuartzBar
    },
    data() {
        return {
            quartzBarContent: [
                {
                    icon: homeOutline,
                    name: tr`Home`,
                    action: () => this.$router.push("/")
                },
                {
                    icon: syncOutline,
                    name: tr`Syncronization`,
                    items: [
                        {
                            name: tr`Sign Up`,
                            action: () => this.$router.push({name: "sign-up"})
                        },
                        {
                            name: tr`Sign In`,
                            action: () => this.$router.push({name: "sign-in"})
                        }
                    ]
                },
                {
                    icon: lockOpenOutline,
                    name: tr`Safety`,
                    items: [
                        {
                            name:"test editor",
                            action: () => this.$router.push({name: "note-create"})
                        },
                        {
                            name:"item2",
                        },
                        {
                            name:"item3",
                        },
                        {
                            name:"item4",
                        },
                        {
                            name:"item5",
                        },
                        {
                            name:"item6",
                        }
                    ]
                },
                {
                    icon: gridOutline,
                    name: tr`Other`,
                    items: [
                        {
                            name:"item"
                        }
                    ]
                }
            ]
        };
    },
    mounted() {
        this.$store.dispatch("notes/updateList");
        window.addEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.addEventListener('keyboardDidHide', this.onKeyboardDidHide);
    },
    methods: {
        // openScanner: async function(){
        //   this.lol = (await BarcodeScanner.scan()).text;
        // }
        onKeyboardDidShow() {
            this.$nextTick(()=>document.querySelector('body').classList.add('hide-main-bar'));
        },
        onKeyboardDidHide() {
            document.querySelector('body').classList.remove('hide-main-bar');
        }
    },
    unmounted() {
        window.removeEventListener('keyboardDidShow', this.onKeyboardDidShow);
        window.removeEventListener('keyboardDidHide', this.onKeyboardDidHide);
    }
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
    
    .hide-main-bar {
        #main-bar {
            display: none;
        }
        #main-content {
            height: 100%;
        }
    }
</style>
