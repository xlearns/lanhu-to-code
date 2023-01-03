import { createRouter, createWebHistory } from 'vue-router'

const routerHistory = createWebHistory()

const routes = [
  { path: '/test',component:()=>import('../views/test.vue') },
  {
    path: '/',
    component:()=>import('../views/transfrom.vue')
  },
  {
    path: '/datav',
    component:()=>import('../views/datav.vue'),
    meta:{
      title:"大屏带滚动条情况适配"
    }
  }
]
const router = createRouter({
  history: routerHistory,
  routes,
})

router.beforeEach(async (to, from, next) => {
  to.matched.some((item) => {
    if (!item.meta.title) {
      return "";
    }
    document.title = item.meta.title;
  });
  next();
});

export default router



