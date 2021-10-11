import axios from 'axios';

import { UserStorage } from './Storage.js';
import { BASE_URL } from '../api.settings.js';


export const AUTH_START = 1;
export const AUTH_SUCCESS = 2;
export const AUTH_ERROR = 3;

export const AUTH_URL = `${BASE_URL}/user/auth/`;
export const REGISTER_URL = `${BASE_URL}/user/register/`;
export const PROFILE_URL = `${BASE_URL}/user/profile/`;


export default {
    namespaced: true,
    state: () => ({
        isAuthenticated: false,
        token: "",
        profile: null,
        status: null
    }),
    mutations: {
        authStart(state) {
            state.status = AUTH_START;
        },
        authSuccess(state, token) {
            state.status = AUTH_SUCCESS;
            state.token = token;
            state.isAuthenticated = true;
        },
        authError(state) {
            state.status = AUTH_ERROR;
        },
        logout(state) {
            state.status = null;
            state.profile = null;
            state.isAuthenticated = false;
            state.token = "";
        },
        setAuth(state, {token, isAuthenticated}) {
            state.token = token;
            state.isAuthenticated = isAuthenticated;
        }
    },
    actions: {
        async init({commit, dispatch}) {
            const userStorage = await UserStorage;
            
            commit('setAuth', {
                token: await userStorage.get('token'),
                isAuthenticated: await userStorage.get('isAuthenticated')
            });
            dispatch('getProfile');
        },
        async updateStorage({state}) {
            const userStorage = await UserStorage;
            await Promise.all([
                userStorage.set('token', state.token),
                userStorage.set('isAuthenticated', state.isAuthenticated),
            ]);
        },
        async startAuth({commit, dispatch}, data) {
            commit('authStart');
            try {
                const res = await axios.post(AUTH_URL, data);
                const token = res.data.access;
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                
                commit('authSuccess', token);
                dispatch('updateStorage');
                dispatch('getProfile');
                
                return res;
            }
            catch(e) {
                delete axios.defaults.headers.common['Authorization'];
                
                commit('authError', e);
                dispatch('updateStorage');
                
                throw e;
            }
        },
        async startRegister({commit, dispatch}, data) {
            commit('authStart');
            try {
                const res = await axios.post(REGISTER_URL, data);
                const token = res.data.access;
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
                
                commit('authSuccess', token);
                dispatch('updateStorage');
                dispatch('getProfile');
                
                return res;
            }
            catch(e) {
                delete axios.defaults.headers.common['Authorization'];
                
                commit('authError', e);
                dispatch('updateStorage');
                
                throw e;
            }
        },
        async logout({commit, dispatch}) {
            commit('logout');
            dispatch('updateStorage', '', false);
        },
        async getProfile({commit, dispatch}) {
            console.log("TODO");
        }
    },
    modules: {
    }
};
