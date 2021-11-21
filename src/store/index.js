import { createStore } from 'vuex';

import note from './note';
import user from './user';

import { Network, Connection } from "@ionic-native/network";


const store = createStore({
    state: {
        // need it to stop updating some components while editing a note
        editing: false,
        notifications: {},
        hasConnection: Network.type !== Connection.NONE
    },
    mutations: {
        setEditing(state) {
            state.editing = true;
        },
        unsetEditing(state) {
            state.editing = false;
        },
        addNotification(state, notification) {
            state.notifications[notification.id] = notification;
        },
        removeNotification(state, id) {
            delete state.notifications[id];
        },
        connectionChange(state, connected) {
            state.hasConnection = connected;
        }
    },
    actions: {
        placeNotification({ commit }, { text, type="info", time=4000 }) {
            const id = Math.random();
            commit('addNotification', {id, text, type});
            setTimeout(()=>{
                commit('removeNotification', id);
            }, time);
        }
    },
    modules: {
        note,
        user
    }
});

export default store;


Network.onConnect().subscribe(()=>store.commit('connectionChange', true));
Network.onDisconnect().subscribe(()=>store.commit('connectionChange', false));
