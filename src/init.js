import localization from './localization';
import axios from 'axios';
import store from './store';

export default async function init() {
    localization.state.setLang();

    axios.interceptors.response.use(undefined, async err => {
        // logout the user when they gets at least one 401
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
            store.dispatch('user/logout');
        }
        throw err;
    });

    axios.interceptors.request.use(config => {
        config.url = config.url.replace(/{{lang}}/gmi, localization.state.tr`__lang_code__`);
        return config;
    });

    // init the stuff
    await store.dispatch("note/sync");
    await store.dispatch("user/init");
    await store.dispatch("note/sync", store.state.user.isAuthenticated);
}
