import {createApp} from 'vue'
import App from './App.vue'

import LeafletMap from './components/LeafletMap.vue'
import MainDashboard from './components/MainDashboard.vue'
import StationGame from './components/StationGame.vue'
import * as VueRouter from "vue-router";

const routes = [
    {path: '/local-tram-map', component: MainDashboard},
    {path: '/local-tram-map/map', component: LeafletMap},
    {path: '/local-tram-map/stations', component: StationGame}
]

const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes,
})

createApp(App)
    .use(router)
    .mount('#app')
