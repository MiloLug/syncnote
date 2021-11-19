import { createStore } from 'vuex';

import note from './note';
import user from './user';

export default createStore({
    state: {
        // need it to stop updating some components while editing a note
        editing: false
    },
    mutations: {
        setEditing(state) {
            state.editing = true;
        },
        unsetEditing(state) {
            state.editing = false;
        }
    },
    actions: {
    },
    modules: {
        note,
        user
    }
});
