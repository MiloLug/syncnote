import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
    {
        path: '',
        redirect: '/notes-list'
    },
    {
        path: '/notes-list',
        component: () => import('../views/NotesList.vue')
    },
    {
        path: '/login',
        component: () => import('../views/Login.vue')
    }
]

const router = createRouter({
    history: createWebHistory("/"),
    routes
})

export default router
