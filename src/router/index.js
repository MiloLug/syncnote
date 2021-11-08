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
        path: '/note-edit',
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
    }
];

const router = createRouter({
    history: createWebHistory("/"),
    routes
});

router.beforeEach((to, from, next) => {
    if((to.name === 'note' || to.name === 'note-edit') && !store.state.note.notes[to.params.id])
        next('/');
    else
        next();
})

export default router
