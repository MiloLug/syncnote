import { NoteStorage } from './storage';


// notes sorting functions:
export const sortUpdatedAtAsc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].updatedAt > notes[b].updatedAt
    );

export const sortUpdatedAtDesc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].updatedAt < notes[b].updatedAt
    );

export const sortTitleAsc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].title > notes[b].title
    );

export const sortTitleDesc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].title < notes[b].title
    );


export default {
    namespaced: true,
    state: () => ({
        
        notes: {},  // {id: Note}
        orderedNotesIds: [],  // [note id]
        
        notesToSave: {},  // {note id: bool}, notes to save locally
        notesToSend: {},  // {note id: bool}, notes to upload to the server

        tags: {},  // {tag name: {note id: bool, ..., __count__: int}}
        orderedTagNames: [],  // [tag name]
        
        orderingFunction: sortUpdatedAtDesc,
    }),
    mutations: {
        newOrdering(state, orderingFunction=sortUpdatedAtDesc) {
            state.orderingFunction = orderingFunction;
            state.orderedNotesIds = orderingFunction(state.notes);
        },

        tagsUpdate(state) {
            // to not disturb the original object
            const tmpTags = {};
            for(const id of state.orderedNotesIds){
                for(const tagName of state.notes[id].tags){
                    const tag = tmpTags[tagName] = tmpTags[tagName]
                        ? tmpTags[tagName]
                        : {__count__: 1};

                    tag[id] = 1;
                }
            }
            // to show more popular tags first
            state.orderedTagNames = Object.getOwnPropertyNames(tmpTags).sort(
                (a, b) => tmpTags[a].__count__ < tmpTags[b].__count__
            );
            state.tags = tmpTags;
        },

        notesOrderingUpdate(state) {
            state.orderedNotesIds = state.orderingFunction(state.notes);
        },

        newNotes(state, notes={}) {
            state.notes = notes;
        },

        newNote(state, {id, ...note}) {
            state.notes[id] = note;

            state.notesToSave[id] = 1;
            state.notesToSend[id] = 1;
        },

        noteUpdate(state, {id, ...note}) {
            state.notes[id] = {
                ...state.notes[id],
                ...note
            };

            state.notesToSave[id] = 1;
            state.notesToSend[id] = 1;
        },

        cleanSavingQueue(state) {
            state.notesToSave = [];
        },
        cleanSendingQueue(state) {
            state.notesToSend = [];
        }
    },
    actions: {
        async collectNotes({ commit }) {
            const noteStorage = await NoteStorage;
            // TODO: remove this
            window.noteStorage = noteStorage;

            const tmpList = {};
            await noteStorage.forEach((value, key, index) => {
                tmpList[key] = value;
            });

            commit('newNotes', tmpList);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');
        },

        async saveLocalNotes({ state, commit }) {
            const noteStorage = await NoteStorage;
            const toSave = Object.keys(state.notesToSave);

            commit('cleanSavingQueue');
            console.log(toSave);
            await Promise.all(toSave.map(
                id => noteStorage.set(id, state.notes[id])
            ))
        },

        async addNote({ commit, dispatch }, note) {
            commit('newNote', {
                id: Math.random().toString(16).slice(2),
                ...note,
                updatedAt: Date.now()
            });
            commit('notesOrderingUpdate');

            if(note.tags !== undefined && note.tags.length)
                commit('tagsUpdate');

            dispatch('saveLocalNotes');
        },

        async updateNote({ state, commit, dispatch }, note) {
            commit('noteUpdate', {
                ...note,
                updatedAt: Date.now()
            });


            // update the ordering only when it's needed
            if(
                state.orderingFunction === sortUpdatedAtDesc
                || state.orderingFunction === sortUpdatedAtAsc
                || note?.title !== undefined
            )
                commit('notesOrderingUpdate');
            
            if(note?.tags !== undefined) commit('tagsUpdate');

            dispatch('saveLocalNotes');
        }
    },
    modules: {
    }
};
