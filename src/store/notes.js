import { NoteStorage } from './Storage.js';


export default {
    namespaced: true,
    state: () => ({
        notesList: {}
    }),
    mutations: {
    },
    actions: {
        async updateNotes({ state }) {
            const noteStorage = await NoteStorage;
            window.noteStorage = noteStorage;
            const tmpList = {};
            await noteStorage.forEach((value, key, index) => {
                tmpList[key] = value;
            });
            state.notesList = tmpList;
        },
        async saveNotes({ state }) {
            const noteStorage = await NoteStorage;
            
            for(const [id, note] of Object.entries(state.notesList)){
                if(note?.changedLocally)
                    noteStorage.set(id, note);
            }
        }
    },
    modules: {
    }
};
