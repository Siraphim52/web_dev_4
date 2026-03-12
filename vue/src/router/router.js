import { createRouter, createWebHistory } from "vue-router";
import Main from "@/components/Main.vue";
import GameView from "@/views/GameView.vue";

const routes = [
  {
    path: '/',
    component: Main
  },
  {
    path: '/game',
    component: GameView
  }
]

const router = createRouter({
  routes,
  history: createWebHistory()
})

export default router;