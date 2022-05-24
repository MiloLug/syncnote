import axios from 'axios';
import { NoteStorage } from './storage';

import { BASE_URL } from '../api.settings.js';
import localization from '@/localization';
import { handleError } from './utils';


export const COLLECT_START = 1;
export const COLLECT_END = 2;

export const NOTES_GENERAL_URL = `${BASE_URL}/notes`;
export const GET_UPDATES_URL = `${NOTES_GENERAL_URL}/get-updates/`;
export const SEND_UPDATES_URL = `${NOTES_GENERAL_URL}/send-updates/`;



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

export const createTagsFilter = filterTags => state => noteId => {
    for (const tagName of filterTags) {
        if (!state.tags[tagName]?.[noteId])
            return false;
    }
    return true;
};

export const createTitleFilter = searchString => state => noteId =>
    state.notes[noteId].title.indexOf(searchString) !== -1;


let finishInitialization;

export default {
    namespaced: true,
    state: () => ({
        initialized: new Promise((res) => (finishInitialization = res)),

        notes: {},  // {id: Note}
        orderedNotes: [],  // [note id]
        filteredNotes: [],  // [note id]
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
        filteringFunctions: [],
    }),
    mutations: {
        collectStart(state) {
            state.status = COLLECT_START;
        },
        collectEnd(state) {
            state.status = COLLECT_END;
        },

        newOrdering(state, orderingFunction=sortUpdatedAtDesc) {
            state.orderingFunction = orderingFunction;
            let notesIds = state.orderedNotes = orderingFunction(state.notes);

            for (const fn of state.filteringFunctions){
                notesIds = notesIds.filter(fn);
            }
            state.filteredNotes = notesIds;
        },

        newFiltering(state, filteringFunctions=[]) {
            state.filteringFunctions = filteringFunctions.map(fn => fn(state));
            let notesIds = state.orderedNotes;
            
            for (const fn of state.filteringFunctions) {
                notesIds = notesIds.filter(fn);
            }
            state.filteredNotes = notesIds;
        },

        tagsUpdate(state) {
            // to not disturb the original object
            const tmpTags = {};
            let notesIds = state.orderedNotes;

            for (let i = 0, len = notesIds.length; i < len; i++) {
                const note = state.notes[notesIds[i]];
                const tags = note.tags;
                const noteId = note.id;

                for (let j = 0, tagsLen = tags.length; j < tagsLen; j++) {
                    const tagName = tags[j];
                    const tag = tmpTags[tagName] = (
                        tmpTags[tagName]
                        ? tmpTags[tagName]
                        : {__count__: 0}
                    );

                    tag[noteId] = true;
                    tag.__count__++;
                }
            }
            // to show more popular tags first
            state.orderedTagNames = Object.getOwnPropertyNames(tmpTags).sort(
                (a, b) => tmpTags[a].__count__ < tmpTags[b].__count__
            );
            state.tags = tmpTags;

            for (let i = 0, len = state.filteringFunctions.length; i < len; i++) {
                notesIds = notesIds.filter(state.filteringFunctions[i]);
            }
            state.filteredNotes = notesIds;
        },

        notesOrderingUpdate(state) {
            let notesIds = state.orderingFunction(state.notes);
            const newLen = notesIds.length;
            
            if (newLen === state.orderedNotes.length) {
                let i = 0;
                for (; i < newLen && notesIds[i] === state.orderedNotes[i]; i++);
                if (i === newLen) {
                    return;
                }
            }

            state.orderedNotes = notesIds;

            for (let i = 0, len = state.filteringFunctions.length; i < len; i++) {
                notesIds = notesIds.filter(state.filteringFunctions[i]);
            }
            state.filteredNotes = notesIds;
        },

        notesFilteringUpdate(state) {
            let notesIds = state.orderedNotes;

            for (let i = 0, len = state.filteringFunctions.length; i < len; i++) {
                notesIds = notesIds.filter(state.filteringFunctions[i]);
            }
            state.filteredNotes = notesIds;
        },

        newNotes(state, notes={}) {
            state.notes = notes;
            state.dataSize = 0;
            state.oversizedNotesSize = 0;
            state.oversizedNotes = {};

            // newer records have bigger chances to fall into the oversized list
            // since they will be handled at the end
            const orderedIds = sortUpdatedAtAsc(notes);
            for (let i = 0, len = orderedIds.length; i < len; i++) {
                const id = orderedIds[i];
                const size = notes[id].dataSize;
                state.dataSize += size;

                if (state.dataSizeLimit !== -1 && (state.dataSize - state.oversizedNotesSize) > state.dataSizeLimit)
                    state.oversizedNotes[id] = 1,
                    state.oversizedNotesSize += size;
            }
        },

        newNote(state, note) {
            const id = note.id;
            state.notes[id] = note;
            state.dataSize += note.dataSize;

            if (state.dataSizeLimit !== -1 && state.dataSize > state.dataSizeLimit)
                state.oversizedNotes[id] = 1,
                state.oversizedNotesSize += note.dataSize;

            state.notesToSave[id] = 1;
            state.notesToSend[id] = 1;
        },

        noteUpdate(state, {id, ...note}) {
            // no dataSize = no size update
            if (note.dataSize !== undefined) {
                const oldSize = state.notes[id].dataSize;
                const newSize = note.dataSize;
                
                if (state.dataSizeLimit !== -1) {
                    // so I can remove it from the oversized if it fits the size limit
                    const realSizeRemain = state.dataSizeLimit - (state.dataSize - state.oversizedNotesSize);

                    if (state.oversizedNotes[id]) {
                        state.oversizedNotesSize -= oldSize;
                        delete state.oversizedNotes[id];
                    }

                    if (newSize > realSizeRemain) {
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

        deleteNote(state, noteId) {
            // no dataSize = no size update
            const note = state.notes[noteId];
            if (!note) return;

            delete state.notes[noteId];

            if (note.dataSize !== undefined) {
                if (state.dataSizeLimit !== -1 && state.oversizedNotes[noteId]) {
                    state.oversizedNotesSize -= note.dataSize;
                    delete state.oversizedNotes[noteId];
                }

                state.dataSize -= note.dataSize;
            }

            delete state.notesToSave[noteId];
            delete state.notesToSend[noteId];

            const remoteId = state.localRemoteIds[noteId];
            if (remoteId) {
                delete state.localRemoteIds[noteId];
                delete state.remoteLocalIds[remoteId];
            }
        },

        cleanSavingQueue(state, id=null) {
            if (id) delete state.notesToSave[id];
            else state.notesToSave = {};
        },
        cleanSendingQueue(state, id=null) {
            if (id) delete state.notesToSend[id];
            else state.notesToSend = {};
        },

        addNotesToSend(state, ids=[]) {
            for (const id of ids) state.notesToSend[id] = 1;
        },
        addNotesToSave(state, ids=[]) {
            for (const id of ids) state.notesToSave[id] = 1;
        },

        dataSizeLimitUpdate(state, limit=-1) {
            state.dataSizeLimit = limit;
            state.oversizedNotesSize = 0;
            state.oversizedNotes = {};

            // newer records have bigger chances to fall into the oversized list
            // since they will be handled at the end
            const orderedIds = sortUpdatedAtAsc(state.notes);
            let dataSize = 0;
            for (const id of orderedIds) {
                const size = state.notes[id].dataSize;
                dataSize += size;

                if (limit !== -1 && dataSize > limit)
                    state.oversizedNotes[id] = 1,
                    state.oversizedNotesSize += size;
            }
        },

        addIdPair(state, {local, remote}) {
            state.notesToSave[local] = 1;

            state.localRemoteIds[local] = remote;
            state.remoteLocalIds[remote] = local;
        },

        cleanIdPairs(state, localId) {
            if (localId) {
                const remoteId = state.localRemoteIds[localId];
                if (remoteId) {
                    delete state.localRemoteIds[localId];
                    delete state.remoteLocalIds[remoteId];
                }
                return;
            }
            state.localRemoteIds = {};
            state.remoteLocalIds = {};
        }
    },
    actions: {
        async collectNotes({ state, commit, dispatch }, useServer=false) {
            const noteStorage = await NoteStorage;
            // TODO: remove this
            window.noteStorage = noteStorage;

            const tmpList = {};
            const notesToSave = [];
            await noteStorage.forEach((value, key) => {
                tmpList[key] = value;
            });

            if (useServer && state.status !== COLLECT_START) {
                commit('collectStart');

                const data = Object.values(tmpList).map(
                    note => ({id: note.id, updated_at: new Date(note.updatedAt).toJSON()})
                );
                try {
                    const res = await axios.post(GET_UPDATES_URL, data);
                    commit('addNotesToSend', res.data?.notes_to_send ?? []);

                    for (const note of res.data?.notes_updated ?? []) {
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
                        };
                        notesToSave.push(note.id);
                    }
                }
                catch(e) {
                    handleError(dispatch, e, 4000, true);
                }
                finally {
                    commit('collectEnd');
                }
            }

            commit('newNotes', tmpList);
            commit('addNotesToSave', notesToSave);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');
            
            finishInitialization();
        },

        async saveLocalNotes({ state, commit }) {
            const noteStorage = await NoteStorage;
            const toSave = Object.keys(state.notesToSave);
            commit('cleanSavingQueue');

            if (!toSave.length) return;

            await Promise.all(toSave.map(
                async id => {
                    // if there is a new id (after uploading to the server),
                    // I'll use it to update the note in the store
                    const realId = state.localRemoteIds[id] ?? id;
                    if (realId !== id)
                        await noteStorage.remove(id);

                    await noteStorage.set(realId, {
                        ...state.notes[id],
                        id: realId,
                        tags: [...state.notes[id].tags]
                    });
                }
            ));
        },

        async saveRemoteNotes({ state, commit, dispatch, rootState }) {
            if (!rootState.hasConnection)
                return;

            const toSave = Object.keys(state.notesToSend).filter(id => !state.oversizedNotes[id]);
            commit('cleanSendingQueue');

            if (!toSave.length) return;

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
                for (const localRemote of res.data ?? []) {
                    commit('addIdPair', {
                        local: localRemote.local_id,
                        remote: localRemote.remote_id
                    });
                }

                return res;
            }
            catch(e) {
                dispatch('placeNotification', {
                    text: localization.state.tr`Send-updates error`,
                    type: "danger"
                }, {root: true});

                commit('addNotesToSend', toSave);
            }
        },

        async sync({ dispatch }, useServer=false) {
            await dispatch('collectNotes', useServer);
            if (useServer) {
                await dispatch('saveRemoteNotes');
            }
            await dispatch('saveLocalNotes');
        },

        async applyIdPairs({ dispatch, commit }) {
            commit('cleanSendingQueue');
            await dispatch('saveLocalNotes');
            commit('cleanIdPairs');
            await dispatch('collectNotes');
        },

        async addNote({ commit }, note) {
            note = {
                ...note,
                tags: [...(note.tags ?? [])],
                updatedAt: Date.now(),
                dataSize: note.content.length
            };
            commit('newNote', note);
            commit('notesOrderingUpdate');

            if (note.tags.length)
                commit('tagsUpdate');
        },
        async updateNote({ state, commit }, note) {
            const oldNote = state.notes[note.id];
            let updateOrdering = false;
            let updateTags = false;

            // update the ordering only when it's needed
            switch(state.orderingFunction) {
                case sortUpdatedAtDesc:
                    updateOrdering = state.orderedNotes[0] !== note.id;
                    break;
                case sortUpdatedAtAsc:
                    updateOrdering = state.orderedNotes[state.orderedNotes.length - 1] !== note.id;
                    break;
                case sortTitleAsc:
                case sortTitleDesc:
                    updateOrdering = note?.title !== oldNote.title;
                    break;
            }
            
            // also don't update tags if they wasn't changed
            if(
                note?.tags !== undefined
                && JSON.stringify(note.tags) !== JSON.stringify(oldNote.tags)
            )
                updateTags = true;


            const update = {
                ...note,
                updatedAt: Date.now()
            };
            if (note.content !== undefined)
                update.dataSize = note.content.length;
            
            commit('noteUpdate', update);

            updateOrdering && commit('notesOrderingUpdate');
            updateTags && commit('tagsUpdate');
        },
        async deleteNote({ state, commit, dispatch, rootState }, noteId) {
            if (!rootState.hasConnection && rootState.user.isAuthenticated) {
                dispatch('placeNotification', {
                    text: localization.state.tr`Can't delete note with no connection`,
                    type: "danger"
                }, {root: true});
                return;
            }

            const noteStorage = await NoteStorage;
            const remoteId = state.localRemoteIds[noteId] ?? noteId;

            commit('deleteNote', noteId);
            await Promise.all([noteStorage.remove(noteId), noteStorage.remove(remoteId)]);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');

            if (rootState.user.isAuthenticated)
                try {
                    await axios.delete(`${NOTES_GENERAL_URL}/${remoteId}`);
                }
                catch(e) {
                    handleError(dispatch, e, 2000, true, {404: true});
                }
        },
        async cloneNote({ state, dispatch }, noteId) {
            const note = state.notes[noteId];
            await dispatch('addNote', {
                ...note,
                id: Math.random().toString(16).slice(2),
                title: (note.title ?? '') + '++'
            });
        },

        async commitNote({ state, dispatch }, note) {
            if (state.notes[note.id])
                dispatch('updateNote', note);
            else
                dispatch('addNote', note);
        }
    },
    modules: {
    }
};
