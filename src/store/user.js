import axios from 'axios';

import { UserStorage } from './storage';
import { BASE_URL } from '../api.settings.js';


export const AUTH_START = 1;
export const AUTH_SUCCESS = 2;
export const AUTH_ERROR = 3;

export const AUTH_URL = `${BASE_URL}/user/auth/`;
export const REGISTER_URL = `${BASE_URL}/user/register/`;
export const PROFILE_URL = `${BASE_URL}/user/profile/`;

export const RESET_PASSWORD = `${BASE_URL}/user/reset-password/`;


function set_axios_auth(token=null) {
    if(token)
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    else
        delete axios.defaults.headers.common['Authorization'];
}


function setQuartzTheme(theme="auto") {
    const classList = document.querySelector("html").classList;
    classList.remove("theme-auto", "theme-dark", "theme-light");
    classList.add("quartz-vars", "theme-"+theme);
}


export default {
    namespaced: true,
    state: () => ({
        isAuthenticated: false,
        token: "",
        profile: null,
        status: null,
        theme: null,
        lang: null
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
        },

        setTheme(state, theme="auto") {
            setQuartzTheme(theme || "auto");
            state.theme = theme;
        },
        setLang(state, lang) {
            state.lang = lang;
        }
    },
    actions: {
        async init({ state, commit, dispatch }) {
            const userStorage = await UserStorage;
            
            commit('setTheme', await userStorage.get('theme'));
            commit('setLang', await userStorage.get('lang'));

            commit('setAuth', {
                token: await userStorage.get('token'),
                isAuthenticated: await userStorage.get('isAuthenticated')
            });

            if(state.isAuthenticated)
                set_axios_auth(state.token);

            dispatch('getProfile');
        },

        async updateStorage({state}) {
            const userStorage = await UserStorage;
            await Promise.all([
                userStorage.set('token', state.token),
                userStorage.set('isAuthenticated', state.isAuthenticated),
                userStorage.set('theme', state.theme),
                userStorage.set('lang', state.lang),
            ]);
        },

        async setTheme({ commit, dispatch }, theme) {
            commit('setTheme', theme);
            dispatch('updateStorage');
        },

        async setLang({ commit, dispatch }, lang) {
            commit('setLang', lang);
            dispatch('updateStorage');
        },

        async startAuth({commit, dispatch}, data) {
            commit('authStart');
            try {
                const res = await axios.post(AUTH_URL, data);
                const token = res.data.access;
                set_axios_auth(token);
                
                commit('authSuccess', token);
                dispatch('updateStorage');
                dispatch('getProfile');
                
                return res;
            }
            catch(e) {
                set_axios_auth();
                
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
                set_axios_auth(token);
                
                commit('authSuccess', token);
                dispatch('updateStorage');
                dispatch('getProfile');
                
                return res;
            }
            catch(e) {
                set_axios_auth();
                
                commit('authError', e);
                dispatch('updateStorage');
                
                throw e;
            }
        },
        async logout({ commit, dispatch }) {
            commit('logout');
            dispatch('updateStorage', '', false);
        },
        async resetPasswordInit(_, data) {
            try {
                await axios.post(RESET_PASSWORD, data);
            }
            catch(e) {
                // todo
            }
        },

        async getProfile({ commit, dispatch }) {
            console.log("TODO");
        }
    },
    modules: {
    }
};
