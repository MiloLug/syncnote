import axios from 'axios';
import { NoteStorage } from './storage';

import { BASE_URL } from '../api.settings.js';


export const COLLECT_START = 1;
export const COLLECT_SUCCESS = 2;
export const COLLECT_ERROR = 3;
export const UPLOAD_START = 4;
export const UPLOAD_SUCCESS = 5;
export const UPLOAD_ERROR = 6;

export const GET_UPDATES_URL = `${BASE_URL}/notes/get-updates/`;
export const SEND_UPDATES_URL = `${BASE_URL}/notes/send-updates/`;


// notes sorting functions:
export const sortUpdatedAtAsc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].updatedAt - notes[b].updatedAt
    );

export const sortUpdatedAtDesc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[b].updatedAt - notes[a].updatedAt
    );

export const sortTitleAsc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[a].title.localeCompare(notes[b].title)
    );

export const sortTitleDesc = notes => 
    Object.getOwnPropertyNames(notes).sort(
        (a, b) => notes[b].title.localeCompare(notes[a].title)
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

        // using this, I won't need to update notes with a new id after uploading them
        localRemoteIds: {},  // {local note id: remote note id}
        remoteLocalIds: {},  // {remote note id: local note id}

        tags: {},  // {tag name: {note id: bool, ..., __count__: int}}
        orderedTagNames: [],  // [tag name]
        
        orderingFunction: sortUpdatedAtDesc,

        status: null
    }),
    mutations: {
        collectStart(state) {
            state.status = COLLECT_START;
        },
        collectError(state) {
            state.status = COLLECT_ERROR;
        },
        collectSuccess(state) {
            state.status = COLLECT_SUCCESS;
        },

        uploadStart(state) {
            state.status = UPLOAD_START;
        },
        uploadError(state) {
            state.status = UPLOAD_ERROR;
        },
        uploadSuccess(state) {
            state.status = UPLOAD_SUCCESS;
        },

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

            // newer records have bigger chances to fall into the oversized list
            // since they will be handled at the end
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
            // no dataSize = no size update
            if(note.dataSize !== undefined){
                const oldSize = state.notes[id].dataSize;
                const newSize = note.dataSize;
                
                if(state.dataSizeLimit !== -1){
                    // so I can remove it from the oversized if it fits the size limit
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

            // newer records have bigger chances to fall into the oversized list
            // since they will be handled at the end
            const orderedIds = sortUpdatedAtAsc(state.notes);
            let dataSize = 0;
            for(const id of orderedIds){
                const size = state.notes[id];
                dataSize += size;

                if(limit !== -1 && dataSize > limit)
                    state.oversizedNotes[id] = 1,
                    state.oversizedNotesSize += size;
            }
        },

        addIdPair(state, {local, remote}) {
            if(!state.localRemoteIds[local])
                state.notesToSave[local] = 1;

            state.localRemoteIds[local] = remote;
            state.remoteLocalIds[remote] = local;
        },

        cleanIdPairs(state) {
            state.localRemoteIds = {};
            state.remoteLocalIds = {};
        }
    },
    actions: {
        async collectNotes({ state, commit }, useServer=false) {
            const noteStorage = await NoteStorage;
            // TODO: remove this
            window.noteStorage = noteStorage;

            const tmpList = {};
            await noteStorage.forEach((value, key) => {
                tmpList[key] = value;
            });

            if(useServer && state.status !== COLLECT_START) {
                commit('collectStart');

                const data = Object.values(tmpList).map(
                    note => ({id: note.id, updated_at: new Date(note.updatedAt).toJSON()})
                );
                try {
                    const res = await axios.post(GET_UPDATES_URL, data);
                    commit('addNotesToSend', res.data?.notes_to_send ?? []);

                    for(const note of res.data?.notes_updated ?? []){
                        const id = state.remoteLocalIds[note.id] ?? note.id;

                        tmpList[id] = {
                            id: id,
                            tags: note.tags ?? [],
                            title: note.title ?? "",
                            content: note.content ?? "",
                            color: note.color ?? null,
                            icon: note.icon ?? null,
                            dataSize: note.data_size ?? (note.content ?? "").length,
                            updatedAt: new Date(note.updated_at).getTime()
                        }
                    }

                    commit('collectSuccess');
                }
                catch(e) {
                    commit('collectError');
                }
            }

            commit('newNotes', tmpList);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');
        },

        async saveLocalNotes({ state, commit }) {
            const noteStorage = await NoteStorage;
            const toSave = Object.keys(state.notesToSave);
            commit('cleanSavingQueue');

            if(!toSave.length) return;

            await Promise.all(toSave.map(
                async id => {
                    // if there is a new id (after uploading to the server),
                    // I'll use it to update the note in the store
                    const realId = state.localRemoteIds[id] ?? id;
                    if(realId !== id)
                        await noteStorage.remove(id);

                    await noteStorage.set(realId, {
                        ...state.notes[id],
                        id: realId,
                        tags: [...state.notes[id].tags]
                    });
                }
            ));
        },

        async saveRemoteNotes({ state, commit }) {
            const toSave = Object.keys(state.notesToSend);
            commit('cleanSendingQueue');

            if(!toSave.length) return;

            commit('uploadStart');

            const data = toSave.map(
                id => ({
                    local_id: state.localRemoteIds[id] ?? id,
                    ...state.notes[id],
                    tags: [...state.notes[id].tags],
                    updated_at: new Date(state.notes[id].updatedAt).toJSON()
                })
            );

            try {
                const res = await axios.post(SEND_UPDATES_URL, data);
                for(const localRemote of res.data ?? []){
                    commit('addIdPair', {
                        local: localRemote.local_id,
                        remote: localRemote.remote_id
                    });
                }

                commit('uploadSuccess');
                return res;
            }
            catch(e) {
                commit('uploadError');
                throw e;
            }
        },

        async sync({ dispatch }, useServer=false) {
            await dispatch('collectNotes', useServer);
            if(useServer) {
                await dispatch('saveRemoteNotes');
                await dispatch('saveLocalNotes');
            }
        },

        async applyIdPairs({ dispatch, commit }) {
            await dispatch('saveLocalNotes');
            commit('cleanIdPairs');
            await dispatch('collectNotes');
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
