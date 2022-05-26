import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from '@/store';
import { generateNoteId } from '@/store/utils';


const routes = [
    {
        path: '',
        redirect: '/notes-list'
    },
    {
        path: '/note/:id',
        component: () => import('../views/Note.vue'),
        name: 'note'
    },
    {
        path: '/note-edit/:id',
        component: () => import('../views/NoteEdit.vue'),
        name: 'note-edit'
    },
    {
        path: '/note-edit/:createId?',
        component: () => import('../views/NoteEdit.vue'),
        name: 'note-create'
    },

    {
        path: '/notes-list',
        component: () => import('../views/NotesList.vue'),
        name: 'notes-list'
    },
    {
        path: '/sign-up',
        component: () => import('../views/SignUp.vue'),
        name: 'sign-up'
    },
    {
        path: '/sign-in',
        component: () => import('../views/SignIn.vue'),
        name: 'sign-in'
    },
    {
        path: '/reset-password',
        component: () => import('../views/ResetPassword.vue'),
        name: 'reset-password'
    },
    {
        path: '/settings',
        component: () => import('../views/Settings.vue'),
        name: 'settings'
    }
];

const router = createRouter({
    history: createWebHistory("/"),
    routes
});

router.beforeEach(async (to, from, next) => {
    await store.state.note.initialized;

    switch(to.name) {
        case 'note':
        case 'note-edit':
            if (!store.state.note.notes[to.params.id]) {
                store.commit('unsetEditing');
                next('/');
            }
            else {
                store.commit('setEditing');
                next();
            }
            break;
        // this was the only way to update it normally
        case 'note-create':
            to.params.createId = generateNoteId();
            console.log(33333, to.params.createId);
            store.commit('setEditing');
            next();
            break;
        default:
            store.commit('unsetEditing');
            next();
    }
});

export default router;
