import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
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
        path: '/login',
        component: () => import('../views/Login.vue'),
        name: 'login'
    }
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router
