import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    // 播客
    {
      path: '/podcast',
      name: 'podcast',
      component: () => import('../views/Podcast.vue')
    },
    // 私人FM
    {
      path:'/privateFM',
      name:'privateFM',
      component: () => import('../views/PrivateFM.vue')
    },
    // 视频
    {
      path:'/video',
      name:'video',
      component: () => import('../views/Video.vue')
    },
    // 关注
    {
      path:'/concern',
      name:'concern',
      component: () => import('../views/Concern.vue')
    },
    // 我喜欢的音乐
    {
      path:'/mylikemusic',
      name:'mylikemusic',
      component: () => import('../views/MylikeMusic.vue')
    },
    // 最近播放
    {
      path:'/latelyPlayed',
      name:'latelyPlayed',
      component: () => import('../views/LatelyPlayed.vue')
    },
    // 我的音乐云盘
    {
      path:'/musicCloud',
      name:'musicCloud',
      component: () => import('../views/MusicCloud.vue')
    },
    // 我的博客
    {
      path:'/myPodcast',
      name:'myPodcast',
      component: () => import('../views/MyPodcast.vue')
    },
    // 我的收藏
    {
      path:'/myCollect',
      name:'myCollect',
      component: () => import('../views/MyCollect.vue')
    },
  ]
})

export default router
