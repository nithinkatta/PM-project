import { createRouter, createWebHistory } from 'vue-router';
// import HomePage from '../components/HomePage.vue';
import FileView from '../components/FileView.vue';
import AdminView from '../components/AdminView.vue';
import UserView from '../components/UserView.vue';
import { useStore } from '../store';

const routes = [
  {
    path: '/',
    name: 'userlog',
    component: UserView
  },
  {
    path: '/fileview',
    name: 'fileview',
    component: FileView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView,
    beforeEnter: (to, from, next) => {
      const store = useStore();
      store.setAuth('admin');
      next();
    }
  },
  {
    path: '/user',
    name: 'user',
    component: UserView,
    beforeEnter: (to, from, next) => {
      const store = useStore();
      store.setAuth('user');
      next();
    }
  },
  {
    path: '/projects/:id',
    name: 'project-details',
    component: FileView,
    props: route => ({name: route.query.name})
  },

  {
    path:'/versions/:id',
    name:'versionscope',
    component:()=> import('../components/VersionScope.vue'),
    props:true,
  },
  {
    path:'/user/projects/:id',
    name:'userproject',
    component:()=> import('../components/FileViewUser.vue'),
  },
  {
    path:'/admin/config',
    name:'config',
    component:()=> import('../views/ConfigFile.vue'),
  },
  {
    path:'/admin/config/HomePage',
    name:'confighome',
    component:()=> import('../views/ConfigHomePage.vue'),
  },
  {
    path:'/admin/config/Projects',
    name:'configprojects',
    component:()=> import('../views/ConfigProject.vue'),
  },
  {
    path:'/admin/config/Versions',
    name:'configversions',
    component:()=> import('../views/ConfigVersion.vue'),
  },
  {
    path:'/HomePage/DetailsComp',
    name:'DetailsComponent',
    component:()=> import('../components/HomePage/DetailsComponent.vue'),
    props:true,
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
