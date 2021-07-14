import { Notes } from './Storage.js';


export default {
    state: () => ({
        notesList: [
            {
                title: 'Test Note 1',
                color: '#e35858',
                iconName: 'pricetagOutline',
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
            {
                title: 'Test Note 2',
                color: '#589be3',
                iconName: 'alertOutline',
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
            {
                title: 'Test Note 3',
                color: null,
                iconName: null,
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
            {
                title: 'Test Note 4',
                color: null,
                iconName: 'pricetagOutline',
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
            {
                title: 'Test Note 5',
                color: '#e35858',
                iconName: 'airplaneOutline',
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
            {
                title: 'Test Note 6',
                color: '#e3a058',
                iconName: 'pricetagOutline',
                content: 'test content\n now test it it is content to test yeah test test test\nmore tests to the content!!!'
            },
        ]
    }),
    mutations: {
    },
    actions: {
        async updateList({ state }) {
            let tmpList = {};
            (await Notes).forEach((key, value, index) => {
                tmpNotes[key] = value;
            });
            notesList = tmpList;
        }
    },
    modules: {
    }
};
