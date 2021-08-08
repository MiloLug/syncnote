import { NoteStorage } from './Storage.js';


export default {
    namespaced: true,
    state: () => ({
        notesList: {}
    }),
    mutations: {
    },
    actions: {
        async updateList({ state }) {
            const noteStorage = await NoteStorage;
            window.noteStorage = noteStorage;
            const tmpList = {};
            await noteStorage.forEach((value, key, index) => {
                tmpList[key] = value;
            });
            state.notesList = tmpList;
        }
    },
    modules: {
    }
};
