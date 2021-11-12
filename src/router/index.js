import { createRouter, createWebHistory } from '@ionic/vue-router';
import store from '../store';


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

    if((to.name === 'note' || to.name === 'note-edit') && !store.state.note.notes[to.params.id])
        next('/');

    // this was the only way to update it normally
    else if(to.name === 'note-create')
        to.params.createId = Math.random().toString(16).slice(2),
        next();

    else
        next();
});

export default router;
