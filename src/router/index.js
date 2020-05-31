import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import api from '@/api'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: () => import('@/views/dashboard/index'),
      children: [
        {
          name: 'dashboard-library',
          path: '/',
          component: () => import('@/views/dashboard/Library'),
        }, {
          name: 'Version Control',
          path: '/version-control',
          component: () => import('@/views/dashboard/VersionControl'),
        }, {
          name: 'Upload',
          path: '/picbed/upload',
          component: () => import('@/views/dashboard/Upload'),
        }, {
          name: 'Gallery',
          path: '/picbed/gallery',
          component: () => import('@/views/dashboard/Gallery'),
        }, {
          name: 'Settings',
          path: '/settings',
          component: () => import('@/views/dashboard/Settings'),
        },
      ]
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('../views/library/index'),
      children: [
        {
          name: 'Viewer',
          path: '/library',
          component: () => import('../views/library/components/Viewer'),
        }, {
          name: 'Editor',
          path: '/library/edit',
          component: () => import('../views/library/components/Editor'),
        }
      ]
    },
    {
      path: '/registration',
      name: 'registration',
      component: () => import('../views/Registration.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginPage.vue')
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      component: () => import('../views/ForgetPassword.vue')
    },
    {
      path: '/error',
      name: 'error',
      component: () => import('../views/Error.vue')
    },
    { path: '*', redirect: '/error', hidden: true }
  ]
})

// 使用钩子函数对路由进行权限跳转
router.beforeEach((to, from, next) => {
  if (store.state.account.isLogin) {
    next();
  } else if(to.path=='/login'){
    next()
  }else {
    const Authorization = localStorage.getItem('Authorization');
    const userId = localStorage.getItem('userId');
    if (Authorization == null || Authorization == '' || userId == null || userId == '') {
      next('/login');
    } else {
      api.userApi.getUserInformation(userId).then(res => {
        if (res.errCode == '00') {
          store.commit("COMMIT_LOGIN", { token: Authorization, id: userId, getInfo: false });
          store.dispatch("SET_USER_INFO", res.data);
          next()
        } else {
          localStorage.setItem('Authorization', '')
          localStorage.setItem('userId', '')
          next('/login');
        }
      })
    }
  }
})

export default router
