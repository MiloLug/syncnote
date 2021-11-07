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
        orderedNotes: [],  // [note id]
        oversizedNotes: {},  // {note id: bool}
        dataSize: 0,
        dataSizeLimit: -1,  // -1 = no restrictions
        oversizedNotesSize: 0,  // need it to get remaining space since I don't store the notes partilly

        notesToSave: {},  // {note id: bool}, notes to save locally
        notesToSend: {},  // {note id: bool}, notes to upload to the server

        tags: {},  // {tag name: {note id: bool, ..., __count__: int}}
        orderedTagNames: [],  // [tag name]
        
        orderingFunction: sortUpdatedAtDesc,
    }),
    mutations: {
        newOrdering(state, orderingFunction=sortUpdatedAtDesc) {
            state.orderingFunction = orderingFunction;
            state.orderedNotes = orderingFunction(state.notes);
        },

        tagsUpdate(state) {
            // to not disturb the original object
            const tmpTags = {};
            for(const id of state.orderedNotes){
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
            state.orderedNotes = state.orderingFunction(state.notes);
        },

        newNotes(state, notes={}) {
            state.notes = notes;
            state.dataSize = 0;
            state.oversizedNotesSize = 0;
            state.oversizedNotes = {};

            // newer records have bigger chances to get into the oversized
            // since they will be handled in the end
            const orderedIds = sortUpdatedAtAsc(notes);
            for(const id of orderedIds){
                const size = notes[id];
                state.dataSize += size;

                if(state.dataSizeLimit !== -1 && state.dataSize > state.dataSizeLimit)
                    state.oversizedNotes[id] = 1,
                    state.oversizedNotesSize += size;
            }
        },

        newNote(state, note) {
            const id = note.id;
            state.notes[id] = note;
            state.dataSize += note.dataSize;

            if(state.dataSizeLimit !== -1 && state.dataSize > state.dataSizeLimit)
                state.oversizedNotes[id] = 1,
                state.oversizedNotesSize += note.dataSize;

            state.notesToSave[id] = 1;
            state.notesToSend[id] = 1;
        },

        noteUpdate(state, {id, ...note}) {
            if(note.dataSize !== undefined){
                const oldSize = state.notes[id].dataSize;
                const newSize = note.dataSize;
                
                if(state.dataSizeLimit !== -1){
                    // so I can remove it from the oversized if it fits size limit
                    const realSizeRemain = state.dataSizeLimit - (state.dataSize - state.oversizedNotesSize);

                    if(state.oversizedNotes[id]){
                        state.oversizedNotesSize -= oldSize;
                        delete state.oversizedNotes[id];
                    }

                    if(note.dataSize > realSizeRemain){
                        state.oversizedNotes[id] = 1;
                        state.oversizedNotesSize += newSize;
                    }
                }

                state.dataSize += newSize - oldSize;
            }

            state.notes[id] = {
                ...state.notes[id],
                ...note
            };

            state.notesToSave[id] = 1;
            state.notesToSend[id] = 1;
        },

        cleanSavingQueue(state, id=null) {
            if(id) state.notesToSave = {};
            else delete state.notesToSave[id];
        },
        cleanSendingQueue(state, id=null) {
            if(id) state.notesToSend = {};
            else delete state.notesToSend[id];
        },

        addNotesToSend(state, ids=[]) {
            for(const id of ids) state.notesToSend[id] = 1;
        },

        dataSizeLimitUpdate(state, limit=-1) {
            state.dataSizeLimit = limit;
            state.oversizedNotesSize = 0;
            state.oversizedNotes = {};

            // newer records have bigger chances to get into the oversized
            // since they will be handled in the end
            const orderedIds = sortUpdatedAtAsc(state.notes);
            let dataSize = 0;
            for(const id of orderedIds){
                const size = state.notes[id];
                dataSize += size;

                if(limit !== -1 && dataSize > limit)
                    state.oversizedNotes[id] = 1,
                    state.oversizedNotesSize += size;
            }
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

            for(const id of toSave){
                noteStorage.set(id, {
                    ...state.notes[id],
                    tags: [...state.notes[id].tags]
                })
            }
        },

        async addNote({ commit }, note) {
            commit('newNote', {
                ...note,
                updatedAt: Date.now(),
                dataSize: note.content.length
            });
            commit('notesOrderingUpdate');

            if(note.tags !== undefined && note.tags.length)
                commit('tagsUpdate');
        },

        async updateNote({ state, commit }, note) {
            const update = {
                ...note,
                updatedAt: Date.now()
            };
            if(note.content !== undefined)
                update.dataSize = note.content.length;
            
            commit('noteUpdate', update);

            const oldNote = state.notes[note.id];

            // update the ordering only when it's needed
            if(
                state.orderingFunction === sortUpdatedAtDesc
                || state.orderingFunction === sortUpdatedAtAsc
                || note?.title !== oldNote.title
            )
                commit('notesOrderingUpdate');
            
            if(
                note?.tags !== undefined
                && JSON.stringify(note.tags) !== JSON.stringify(oldNote.tags)
            )
                commit('tagsUpdate');
        },

        async commitNote({ state, dispatch }, note) {
            if(state[note.id])
                dispatch('updateNote', note);
            else
                dispatch('addNote', note);
        }
    },
    modules: {
    }
};
