import axios from 'axios';
import { NoteStorage, CommonStorage, DeletionStorage } from './storage';

import { BASE_URL } from '@/api.settings.js';
import localization from '@/localization';
import { handleError, calculateNoteSize, sort, generateNoteId } from './utils';


export const COLLECT_START = 1;
export const COLLECT_END = 2;

export const NOTES_GENERAL_URL = `${BASE_URL}/notes`;
export const EXCHANGE_ACTIONS_URL = `${NOTES_GENERAL_URL}/exchange-actions/`;
export const APPLY_UPDATES_URL = `${NOTES_GENERAL_URL}/apply-updates/`;


let finishInitialization;

export default {
    namespaced: true,
    state: () => ({
        initialized: new Promise((res) => (finishInitialization = res)),

        lastServerUpdateTime: null,  // time

        notes: {},  // {id: Note}
        orderedNotes: [],  // [note id]
        filteredNotes: [],  // [note id]
        oversizedNotes: {},  // {note id: bool}
        dataSize: 0,
        dataSizeLimit: -1,  // -1 = no restrictions
        oversizedNotesSize: 0,  // need it to get remaining space since I don't store the notes partilly
        
        remoteDeletions: {},  // {note id: time}
        
        notesToSave: {},  // {note id: bool}, notes to save locally
        notesToSend: {},  // {note id: bool}, notes to upload to the server

        // using this, I won't need to update notes with a new id after uploading them
        localRemoteIds: {},  // {local note id: remote note id}
        remoteLocalIds: {},  // {remote note id: local note id}

        tags: {},  // {tag name: {note id: bool, ..., __count__: int}}
        orderedTagNames: [],  // [tag name]
        
        orderingFunction: sort.updatedAtDesc,
        filteringFunctions: [],
    }),
    mutations: {
        collectStart(state) {
            state.status = COLLECT_START;
        },
        collectEnd(state) {
            state.status = COLLECT_END;
        },

        updateLastServerUpdateTime(state) {
            state.lastServerUpdateTime = Date.now();
        },
        setLastServerUpdateTime(state, time) {
            state.lastServerUpdateTime = time;
        },

        newOrdering(state, orderingFunction=sort.updatedAtDesc) {
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
            const orderedIds = sort.updatedAtAsc(notes);
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
                state.remoteDeletions[remoteId] = Date.now();
                delete state.localRemoteIds[noteId];
                delete state.remoteLocalIds[remoteId];
            }
            else
                state.remoteDeletions[noteId] = Date.now();
        },

        setRemoteDeletions(state, remoteDeletions) {
            state.remoteDeletions = {...remoteDeletions};
        },
        addRemoteDeletions(state, remoteDeletions) {
            state.remoteDeletions = {...state.remoteDeletions, ...remoteDeletions};
        },
        cleanRemoteDeletions(state, id=null) {
            if (id) delete state.remoteDeletions[id];
            else state.remoteDeletions = {};
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
            const orderedIds = sort.updatedAtAsc(state.notes);
            let dataSize = 0;
            for (let i = 0, len = orderedIds.length; i < len; i++) {
                const id = orderedIds[i];
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
        async init({ commit, dispatch }, useServer=false) {
            const noteStorage = await NoteStorage;
            const commonStorage = await CommonStorage;
            const deletionStorage = await DeletionStorage;
            
            const tmpDeletions = {};
            await deletionStorage.forEach((value, key) => {
                tmpDeletions[key] = value;
            });

            const tmpNotesList = {};
            await noteStorage.forEach((value, key) => {
                tmpNotesList[key] = value;
            });

            const lastServerUpdateTime =await commonStorage.get('lastServerUpdateTime') ?? Date.now();

            const notesToSend = lastServerUpdateTime
                ? Object.entries(tmpNotesList)
                    .filter(
                        ([, {updatedAt}]) => updatedAt > lastServerUpdateTime
                    ).map(
                        ([note_id, ]) => note_id
                    )
                : Object.keys(tmpNotesList)

            commit('setLastServerUpdateTime', lastServerUpdateTime);
            commit('setRemoteDeletions', tmpDeletions);
            commit('newNotes', tmpNotesList);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');
            commit('addNotesToSend', notesToSend);

            await dispatch('sync', useServer);

            finishInitialization();useServer
        },

        async sync({ state, commit, dispatch }, useServer=false) {
            if (state.status === COLLECT_START) return;
            commit('collectStart');

            const deletionStorage = await DeletionStorage;
            const commonStorage = await CommonStorage;

            await dispatch('saveLocalNotes');

            // Save deletions (just in case)
            await Promise.all(Object.entries(state.remoteDeletions).map(
                async ([id, time]) => {
                    await deletionStorage.set(id, time);
                }
            ));

            if (useServer) {
                let requestData, res;
                
                // Send exchange request
                requestData = {
                    last_update_time: state.lastServerUpdateTime ? new Date(state.lastServerUpdateTime).toJSON() : null,
                    
                    updates: Object.keys(state.notesToSend).map(
                        noteId => ({
                            note_id: state.localRemoteIds[noteId] ?? noteId,
                            time: new Date(state.notes[noteId].updatedAt).toJSON()
                        })
                    ),
                    
                    deletions: Object.entries(state.remoteDeletions).map(
                        ([noteId, time]) => ({
                            note_id: noteId,
                            time: new Date(time).toJSON(),
                        })
                    ),
                };
                commit('cleanRemoteDeletions');
                commit('cleanSendingQueue');

                try {
                    res = await axios.post(EXCHANGE_ACTIONS_URL, requestData);
                    const {
                        update_on_client: updateOnClient,
                        update_requested: updateRequested,
                        deletions
                    } = res.data;

                    // Transform updates from server
                    const tmpNotesList = new Array(updateOnClient.length);
                    const notesToSave = new Array(updateOnClient.length);
                    for (let i = 0, len = updateOnClient.length; i < len; i++) {
                        const note = updateOnClient[i];
                        const id = state.remoteLocalIds[note.id] ?? note.id;

                        tmpNotesList[i] = {
                            id: id,
                            tags: note.tags ?? [],
                            title: note.title ?? "",
                            content: note.content ?? "",
                            color: note.color ?? null,
                            icon: note.icon ?? null,
                            dataSize: note.data_size ?? calculateNoteSize(note),
                            updatedAt: new Date(note.updated_at).getTime()
                        };
                        notesToSave[i] = note.id;
                    }

                    // Send updates to server and receive client-server id pairs
                    requestData = new Array(updateRequested.length);
                    for (let i = 0, len = updateRequested.length; i < len; i++) {
                        const serverId = updateRequested[i];
                        const clientId = state.remoteLocalIds[serverId] ?? serverId;
                        const note = state.notes[clientId];

                        requestData[i] = {
                            server_id: serverId,
                            ...note,
                            tags: [...note.tags],
                            updated_at: new Date(note.updatedAt).toJSON()
                        };
                    }

                    try {
                        res = await axios.post(APPLY_UPDATES_URL, requestData);
                        for (let i = 0, len = res.data.length; i < len; i++) {
                            const {
                                client_note_id: clientId,
                                server_note_id: serverId,
                            } = res.data[i];

                            commit('addIdPair', {local: clientId, remote: serverId});
                        }

                        const updateTime = Date.now();
                        commit('setLastServerUpdateTime', updateTime);
                        await commonStorage.set('lastServerUpdateTime', updateTime);
                    }
                    catch(e) {
                        dispatch('placeNotification', {
                            text: localization.state.tr`Send-updates error`,
                            type: "danger"
                        }, {root: true});

                        // add notes back, so the algorhytm will try to send them again
                        // can use map here since it's not usual case
                        commit('addNotesToSend', updateRequested.map(
                            noteId => state.remoteLocalIds[noteId] ?? noteId
                        ));
                    }

                    // Apply updates from server
                    // TODO: add 'commitNotesBulk'
                    for (let i = 0, len = tmpNotesList.length; i < len; i++)
                        dispatch('commitNote', tmpNotesList[i]);

                    // Apply deletions from server
                    for (let i = 0, len = deletions.length; i < len; i++) {
                        const deletion = deletions[i];
                        const noteId = state.remoteLocalIds[deletion.note_id] ?? deletion.note_id;
                        commit('deleteNote', noteId);
                    }

                    await deletionStorage.clear();
            

                }
                catch(e) {
                    handleError(dispatch, e, 4000, true);
                }
            }

            await dispatch('saveLocalNotes');

            commit('collectEnd');
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
                    const remoteId = state.localRemoteIds[id] ?? id;
                    if (remoteId !== id)
                        await noteStorage.remove(id);

                    await noteStorage.set(remoteId, {
                        ...state.notes[id],
                        id: remoteId,
                        tags: [...state.notes[id].tags]
                    });
                }
            ));
        },

        /**
         * 'localization' here is changing all the ids to local (client) ids
         * not safe if:
         *   a note is currently being edited
         */
        async localizeNotes({ state, commit, dispatch }) {
            const noteStorage = await NoteStorage;

            commit('cleanSendingQueue');
            commit('cleanSavingQueue');
            commit('cleanIdPairs');

            await Promise.all(Object.entries(state.notes).map(
                async ([, note]) => {
                    const id = generateNoteId();
                    await noteStorage.set(id, {
                        ...note,
                        id,
                        tags: [...note.tags]
                    });
                }
            ));

            dispatch('init');
        },

        async addNote({ commit }, note) {
            note = {
                ...note,
                tags: [...(note.tags ?? [])],
                updatedAt: Date.now(),
                dataSize: calculateNoteSize(note)
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
                case sort.updatedAtDesc:
                    updateOrdering = state.orderedNotes[0] !== note.id;
                    break;
                case sort.updatedAtAsc:
                    updateOrdering = state.orderedNotes[state.orderedNotes.length - 1] !== note.id;
                    break;
                case sort.titleAsc:
                case sort.titleDesc:
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

            const newSize = calculateNoteSize({...oldNote, ...update});
            if (oldNote.dataSize !== newSize)
                update.dataSize = newSize;
            
            commit('noteUpdate', update);

            updateOrdering && commit('notesOrderingUpdate');
            updateTags && commit('tagsUpdate');
        },
        async deleteNote({ state, commit }, noteId) {
            const noteStorage = await NoteStorage;
            const remoteId = state.localRemoteIds[noteId] ?? noteId;

            commit('deleteNote', noteId);
            await Promise.all([noteStorage.remove(noteId), noteStorage.remove(remoteId)]);
            commit('notesOrderingUpdate');
            commit('tagsUpdate');
        },
        async cloneNote({ state, dispatch }, noteId) {
            const note = state.notes[noteId];
            await dispatch('addNote', {
                ...note,
                id: generateNoteId(),
                title: (note.title ?? '') + ' +'
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
