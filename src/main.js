import {createApp} from 'vue'
import App from './App.vue'

import LeafletMap from './components/LeafletMap.vue'
import MainDashboard from './components/MainDashboard.vue'
import StationGame from './components/StationGame.vue'
import * as VueRouter from "vue-router";

const routes = [
    {path: '/', component: MainDashboard},
    {path: '/map', component: LeafletMap},
    {path: '/stations', component: StationGame}
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
