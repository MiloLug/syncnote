export default {
    namespaced: true,
    state: () => ({
        demandersNumber: 0,  // shows how many times the screen was demanded to show up
        show: false
    }),
    mutations: {
        show(state) {
            state.demandersNumber++;
            state.show = true;
        },

        hide(state, forced=false) {
            if (state.demandersNumber === 0)
                return;

            if (forced)
                state.show = state.demandersNumber = 0;
            else
                state.show = !! --state.demandersNumber;
        }
    },
    actions: {
    },
    modules: {
    }
};
